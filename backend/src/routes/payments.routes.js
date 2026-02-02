import { Router } from "express";
import { createPaymentIntent } from "../controllers/payments.controller.js";
import { authRequired } from "../middlewares/validateToken.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Stripe Payment integration
 */

/**
 * @swagger
 * /payments/create-payment-intent:
 *   post:
 *     summary: Initialize Stripe Payment Intent
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - total
 *             properties:
 *               total:
 *                 type: number
 *                 description: Total amount to charge
 *                 example: 25.5
 *     responses:
 *       200:
 *         description: Client secret for Stripe frontend
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientSecret:
 *                   type: string
 */
router.post("/create-payment-intent", authRequired, createPaymentIntent);

export default router;
