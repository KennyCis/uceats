import express from 'express'; 
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import http from "http"; 
import swaggerUi from "swagger-ui-express";
import { Server as SocketServer } from "socket.io"; 
import { connectDB } from "./db.js";
import { swaggerSpec } from "./swagger.js";

// Routes Imports
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/products.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import paymentRoutes from "./routes/payments.routes.js";
import statsRoutes from "./routes/stats.routes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Allowed domains for CORS (Frontend)
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

// Socket.io Configuration
const io = new SocketServer(server, {
    cors: {
        origin: allowedOrigins, 
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

// Database Connection
connectDB();

// Middlewares
app.use(cors({
    origin: allowedOrigins, 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Inject Socket.io into request
app.use((req, res, next) => {
    req.io = io;
    next();
});

//Swagger route
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