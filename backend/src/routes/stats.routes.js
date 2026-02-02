import { Router } from "express";
import { getStatsSummary } from "../controllers/stats.controller.js";
import { authRequired } from "../middlewares/validateToken.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Admin Dashboard Statistics
 */

/**
 * @swagger
 * /stats/summary:
 *   get:
 *     summary: Get dashboard statistics (revenue, orders, top products)
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: range
 *         schema:
 *           type: string
 *           enum: [today, week, month, all]
 *         description: Time range filter
 *     responses:
 *       200:
 *         description: Stats summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 revenue:
 *                   type: number
 *                 orders:
 *                   type: integer
 *                 lowStockCount:
 *                   type: integer
 *                 topProducts:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/summary", authRequired, getStatsSummary);

export default router;
