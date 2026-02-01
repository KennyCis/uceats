import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";
import { sendPaymentReceipt } from "../libs/mailer.js"; // Import mailer

// Get all active orders (Admin)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({ archived: false })
            .populate("client", "name email")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching orders" });
    }
};

// Get specific user orders (History)
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ client: req.params.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user orders" });
    }
};

// Create new order
export const createOrder = async (req, res) => {
    const { userId, cart, total } = req.body;

    try {
        // 1. Check Stock
        for (const item of cart) {
            const productDB = await Product.findById(item._id);
            if (!productDB || productDB.stock < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for ${item.name}` });
            }
        }

        // 2. Create Order Object
        const newOrder = new Order({
            client: userId,
            items: cart.map(item => ({
                product: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            total: total,
            status: "pending",
            archived: false
        });

        const savedOrder = await newOrder.save();

        // 3. Update Stock
        for (const item of cart) {
            await Product.findByIdAndUpdate(item._id, { $inc: { stock: -item.quantity } });
        }

        // 4. Populate client data for response and email
        await savedOrder.populate("client", "name email");

        // 5. Send Email Receipt (Async)
        if (savedOrder.client && savedOrder.client.email) {
            sendPaymentReceipt(
                savedOrder.client.email, 
                savedOrder.client.name, 
                savedOrder._id, 
                savedOrder.total
            );
        }

        // 6. Notify Kitchen via Socket
        if (req.io) {
            req.io.emit("server:neworder", savedOrder);
        }

        res.json(savedOrder);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating order" });
    }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        );

        if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

        // Notify client via Socket
        if (req.io) {
            req.io.emit("server:orderupdated", updatedOrder);
        }

        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating order" });
    }
};

// Archive order (Soft delete)
export const archiveOrder = async (req, res) => {
    try {
        await Order.findByIdAndUpdate(req.params.id, { archived: true });
        res.json({ message: "Order archived" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error archiving order" });
    }
};