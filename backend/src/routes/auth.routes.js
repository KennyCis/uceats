import { Router } from "express";
import {
  register,
  login,
  updateProfile,
  googleLogin,
} from "../controllers/auth.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@uceats.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful (returns JWT token)
 *       400:
 *         description: User not found or invalid password
 */
router.post("/login", login);

/**
 * @swagger
 * /google:
 *   post:
 *     summary: Login with Google (Auto-Register)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Google ID Token received from frontend
 *     responses:
 *       200:
 *         description: Login successful (returns App JWT)
 *       400:
 *         description: Google authentication failed
 */
router.post("/google", googleLogin);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists or invalid data
 */
router.post("/register", upload.single("image"), register);

/**
 * @swagger
 * /profile/{id}:
 *   put:
 *     summary: Update user profile
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: User not found
 */
router.put("/profile/:id", upload.single("image"), updateProfile);

export default router;
