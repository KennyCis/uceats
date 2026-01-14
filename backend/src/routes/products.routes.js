import { Router } from "express";
import { getProducts, createProduct, deleteProduct, updateProduct } from "../controllers/products.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

// Routes
router.get("/products", getProducts);
router.get("/products", getProducts);

// <--- 2. Add 'upload.single("image")' middleware

router.post("/products", upload.single("image"), createProduct);
router.put("/products/:id", upload.single("image"), updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;