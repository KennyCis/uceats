import express from 'express'; 
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from "./db.js";
import http from "http";
import { Server as SocketServer } from "socket.io";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/products.routes.js";
import orderRoutes from "./routes/orders.routes.js";

// Initialize dotenv to use .env variables
dotenv.config();

const app = express();

const server = http.createServer(app);

const io = new SocketServer(server, {
    cors: {
        origin: "http://localhost:5173", // Tu Frontend
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true
    }
});

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

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use("/api", authRoutes);
app.use("/api", productRoutes)
app.use("/api/orders", orderRoutes);

io.on("connection", (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);
    
    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// Test Route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to UCEats API" });
});

// Port configuration
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`UCEats server running on port ${PORT}`);
});