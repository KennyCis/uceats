import { Router } from "express";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/products.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all available products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Unique product ID
 *                   name:
 *                     type: string
 *                     description: Product name
 *                   price:
 *                     type: number
 *                     description: Unit price
 *                   category:
 *                     type: string
 *                     description: Product category
 *                   stock:
 *                     type: number
 *                     description: Available stock
 */
router.get("/products", getProducts);

router.post("/products", upload.single("image"), createProduct);
router.put("/products/:id", upload.single("image"), updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;
