import express from 'express'; 
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import http from "http"; 
import fs from 'fs'; 
import morgan from 'morgan'; 
import helmet from "helmet"; 
import { Server as SocketServer } from "socket.io"; 
import { connectDB } from "./db.js";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/products.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import paymentRoutes from "./routes/payments.routes.js";
import statsRoutes from "./routes/stats.routes.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

dotenv.config();

const app = express();
const server = http.createServer(app);


const allowedOrigins = [
    "http://localhost:5173", 
    "http://localhost:5174",
    "http://3.227.144.60", 
    "http://3.227.144.60:3000",
    "http://kenny-cisneros.programacionwebuce.net",
    "https://kenny-cisneros.programacionwebuce.net" 
];
 
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }, 
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// --- SOCKET.IO ---
const io = new SocketServer(server, {
    cors: {
        origin: allowedOrigins, 
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true
    }
});

connectDB();

// --- LOGS ---
const logDirectory = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), { flags: 'a' });

app.use(morgan('combined', { stream: accessLogStream })); 
app.use(morgan('dev')); 


app.use(cors({
    origin: allowedOrigins, 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"] 
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


app.use((req, res, next) => {
    req.io = io;
    next();
});




app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/stats", statsRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Welcome to UCEats API" });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});