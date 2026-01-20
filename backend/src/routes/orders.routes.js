import { Router } from "express";
import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";

const router = Router();

// GET ALL ORDERS (Only Active/Visible for Admin)
router.get("/", async (req, res) => {
    try {
        // 👇 FILTER: Only show orders that are NOT archived
        const orders = await Order.find({ archived: false }) 
            .populate("client", "name email")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
    }
});

// GET USER ORDERS (History for Student - SHOW EVERYTHING)
router.get("/user/:userId", async (req, res) => {
    try {
        // 👇 NO FILTER: Student sees everything, even archived ones
        const orders = await Order.find({ client: req.params.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user orders" });
    }
});

// CREATE ORDER
router.post("/", async (req, res) => {
    const { userId, cart, total } = req.body;

    try {
        // 1. Check Stock
        for (const item of cart) {
            const productDB = await Product.findById(item._id);
            if (!productDB || productDB.stock < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for ${item.name}` });
            }
        }

        // 2. Create Order
        const newOrder = new Order({
            client: userId,
            items: cart.map(item => ({
                product: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            total: total,
            isPaid: false,
            archived: false // Default
        });

        const savedOrder = await newOrder.save();

        // 3. Update Stock
        for (const item of cart) {
            await Product.findByIdAndUpdate(item._id, { $inc: { stock: -item.quantity } });
        }

        await savedOrder.populate("client", "name email");

        // 4. Notify Admin
        req.io.emit("server:neworder", savedOrder); 

        res.json(savedOrder);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating order" });
    }
});

// UPDATE STATUS
router.patch("/:id", async (req, res) => {
    try {
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        );

        req.io.emit("server:orderupdated", updatedOrder);
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error updating order" });
    }
});

// SOFT DELETE (Archive instead of Remove)
router.delete("/:id", async (req, res) => {
    try {
        // Instead of findByIdAndDelete, we update the flag
        await Order.findByIdAndUpdate(req.params.id, { archived: true });
        
        res.json({ message: "Order archived (hidden from kitchen)" });
    } catch (error) {
        res.status(500).json({ message: "Error archiving order" });
    }
});

export default router;