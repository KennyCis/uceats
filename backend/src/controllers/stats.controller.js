import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";

export const getStatsSummary = async (req, res) => {
    try {
        // 1. Get the range from URL query (e.g., ?range=today)
        const { range } = req.query;
        
        // 2. Define Start Date based on the filter
        let startDate = new Date(0); // Default: Beginning of time ("all")
        const now = new Date();

        if (range === 'today') {
            startDate = new Date();
            startDate.setHours(0, 0, 0, 0);
        } else if (range === 'week') {
            startDate = new Date();
            startDate.setDate(now.getDate() - 7);
        } else if (range === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        // 3. Create the filter object for MongoDB
        const dateFilter = { 
            createdAt: { $gte: startDate } 
        };

        // --- CALCULATIONS ---

        // A. Total Revenue & Total Orders (Filtered by Date)
        const revenueStats = await Order.aggregate([
            { $match: dateFilter },
            { 
                $group: { 
                    _id: null, 
                    totalRevenue: { $sum: "$total" },
                    count: { $sum: 1 }
                } 
            }
        ]);

        const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;
        const totalOrders = revenueStats.length > 0 ? revenueStats[0].count : 0;

        // B. Top Selling Products (Filtered by Date)
        const topProducts = await Order.aggregate([
            { $match: dateFilter },
            { $unwind: "$items" },
            { 
                $group: { 
                    _id: "$items.name", 
                    totalSold: { $sum: "$items.quantity" },
                    revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
                } 
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);

        // C. Low Stock Products 
        const lowStockProducts = await Product.countDocuments({ stock: { $lte: 5 } });

        // 4. Send Response
        res.json({
            revenue: totalRevenue,
            orders: totalOrders,
            topProducts,
            lowStockCount: lowStockProducts
        });

    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ message: "Error generating stats" });
    }
};