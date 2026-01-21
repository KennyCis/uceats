import { Router } from "express";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

const router = Router();

router.get("/summary", async (req, res) => {
    try {
        //Calculate Total Revenue & Total Orders
        const orders = await Order.find();
        
        const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
        const totalOrders = orders.length;

        // Calculate Top Selling Products
        const topProducts = await Order.aggregate([
            { $unwind: "$items" },
            { 
                $group: { 
                    _id: "$items.name", 
                    totalSold: { $sum: "$items.quantity" },
                    revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
                } 
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 } // Top 5
        ]);

        //Count Low Stock Products 
        const lowStockProducts = await Product.countDocuments({ stock: { $lte: 5 } });

        res.json({
            revenue: totalRevenue,
            orders: totalOrders,
            topProducts,
            lowStockCount: lowStockProducts
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error generating stats" });
    }
});

export default router;