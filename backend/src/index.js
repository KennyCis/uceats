import express from 'express'; 
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/products.routes.js";
import orderRoutes from "./routes/orders.routes.js";

// Initialize dotenv to use .env variables
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true                
}));
app.use(express.json());
// Routes
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use("/api", authRoutes);
app.use("/api", productRoutes)
app.use("/api/orders", orderRoutes);

// Test Route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to UCEats API" });
});

// Port configuration
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`UCEats server running on port ${PORT}`);
});