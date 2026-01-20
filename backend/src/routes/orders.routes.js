import { Router } from "express";
import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js"; 

const router = Router();

// CREATE ORDEN (Checkout)
router.post("/", async (req, res) => {
    // userId, items 
    const { userId, cart, total } = req.body;

    try {
        //STOCK
        for (const item of cart) {
            const productDB = await Product.findById(item._id);
            if (!productDB || productDB.stock < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for ${item.name}` });
            }
        }

        // 2. Create Order in DB (Pending Payment)
        const newOrder = new Order({
            client: userId,
            items: cart.map(item => ({
                product: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            total: total,
            isPaid: false // still not paid
        });

        const savedOrder = await newOrder.save();

        // Descot Stock
        for (const item of cart) {
            await Product.findByIdAndUpdate(item._id, { 
                $inc: { stock: -item.quantity } 
            });
        }

        //SOCKET EMIT
        // "server:neworder" 
        req.io.emit("server:neworder", savedOrder); 

        res.json(savedOrder);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating order" });
    }
});

// GET ORDERS (For the Admin Dashboard)
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("client", "name email") 
            .sort({ createdAt: -1 }); 
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
    }
});

//UPDATE ORDER STATUS
router.patch("/:id", async (req, res) => {
    try {
        const { status } = req.body; // e.g., "completed"
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        );
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error updating order" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: "Order deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting order" });
    }
});

export default router;