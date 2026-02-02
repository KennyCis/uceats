import { Router } from "express";
import { 
    getAllOrders, 
    getUserOrders, 
    createOrder, 
    updateOrderStatus, 
    archiveOrder 
} from "../controllers/orders.controller.js";
import { authRequired } from "../middlewares/validateToken.middleware.js"; 

const router = Router();

// GET ALL ORDERS 
router.get("/", authRequired, getAllOrders); 

// GET USER ORDERS 
router.get("/user/:userId", authRequired, getUserOrders); //

// CREATE ORDER 
router.post("/", authRequired, createOrder); 

// UPDATE STATUS 
router.patch("/:id", authRequired, updateOrderStatus); 

// ARCHIVE ORDER 
router.delete("/:id", authRequired, archiveOrder); 

export default router;