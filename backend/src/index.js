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

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

const io = new SocketServer(server, {
    cors: {
        origin: allowedOrigins, 
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true
    }
});

connectDB();


app.use(cors({
    origin: allowedOrigins, 
    credentials: true                
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api/orders", orderRoutes);

io.on("connection", (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);
});

app.get('/', (req, res) => {
  res.json({ message: "Welcome to UCEats API" });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`UCEats server running on port ${PORT}`);
});