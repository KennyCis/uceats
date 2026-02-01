import { Router } from "express";
import { 
    getAllOrders, 
    getUserOrders, 
    createOrder, 
    updateOrderStatus, 
    archiveOrder 
} from "../controllers/orders.controller.js";

const router = Router();

// GET ALL ORDERS (Only Active/Visible for Admin)
router.get("/", getAllOrders);

// GET USER ORDERS (History for Student)
router.get("/user/:userId", getUserOrders);

// CREATE ORDER
router.post("/", createOrder);

// UPDATE STATUS (PATCH)
router.patch("/:id", updateOrderStatus);

// ARCHIVE ORDER (DELETE visually)
router.delete("/:id", archiveOrder);

export default router;