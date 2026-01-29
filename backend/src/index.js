import express from 'express'; 
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import http from "http"; 
import fs from 'fs'; // Import File System
import morgan from 'morgan'; // Import Morgan
import { Server as SocketServer } from "socket.io"; 
import { connectDB } from "./db.js";

// Routes Imports
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/products.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import paymentRoutes from "./routes/payments.routes.js";
import statsRoutes from "./routes/stats.routes.js";

// Swagger Imports
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Allowed domains for CORS (Frontend)
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

// Socket.io Configuration
const io = new SocketServer(server, {
    cors: {
        origin: allowedOrigins, 
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true
    }
});

// Database Connection
connectDB();

// --- LOGGING CONFIGURATION (NEW) ---
// 1. Ensure logs directory exists
const logDirectory = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// 2. Create write stream (append mode)
const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), { flags: 'a' });

// 3. Apply Middlewares
app.use(morgan('combined', { stream: accessLogStream })); // Write to file (Standard Apache format)
app.use(morgan('dev')); // Write to console (Colored for dev)

// General Middlewares
app.use(cors({
    origin: allowedOrigins, 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"] 
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Inject Socket.io into request
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Swagger Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/stats", statsRoutes);

// Root Endpoint
app.get('/', (req, res) => {
    res.json({ message: "Welcome to UCEats API" });
});

// Server Initialization
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});