import express from "express";
import { generateInsight } from "../controllers/gemini.controller.js";

const geminiRouter = express.Router();

/**
 * @swagger
 * /api/gemini/insight:
 *   post:
 *     summary: Generate AI fitness insight
 *     description: Generate personalized fitness insights and recommendations using Gemini AI based on user data
 *     tags: [Gemini AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: The prompt for generating fitness insights
 *                 example: "Analyze my workout performance and provide recommendations"
 *     responses:
 *       200:
 *         description: AI insight generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 text:
 *                   type: string
 *                   description: Generated AI insight text
 *                   example: "Based on your recent workouts, I recommend focusing on recovery..."
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T10:30:00.000Z"
 *       400:
 *         description: Bad request - missing prompt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
geminiRouter.post("/insight", generateInsight);

export default geminiRouter;
