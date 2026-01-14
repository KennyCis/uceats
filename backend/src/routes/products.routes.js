import { Router } from "express";
import { getProducts, createProduct, deleteProduct, updateProduct } from "../controllers/products.controller.js";

const router = Router();

// Routes
router.get("/products", getProducts);
router.post("/products", createProduct);
router.delete("/products/:id", deleteProduct);
router.put("/products/:id", updateProduct);

export default router;