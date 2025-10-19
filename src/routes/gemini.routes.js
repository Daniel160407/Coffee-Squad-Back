import express from "express";
import { generateInsight } from "../controllers/gemini.controller.js";

const geminiRouter = express.Router();

/**
 * @swagger
 * /api/gemini/insight:
 *   post:
 *     summary: Generate AI fitness insight
 *     description: Generate personalized fitness insights and recommendations using Gemini AI. Creates and saves the insight to the database with structured data including quick replies and recommendations.
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
 *               - userId
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: The prompt for generating fitness insights
 *                 example: "Analyze my workout performance and provide recommendations"
 *               userId:
 *                 type: string
 *                 description: The ID of the user requesting the insight
 *                 example: "507f1f77bcf86cd799439011"
 *               insightType:
 *                 type: string
 *                 enum: ["daily-summary", "weekly-summary", "monthly-summary", "performance-analysis", "nutrition-feedback", "recommendation", "custom-query"]
 *                 description: Type of insight to generate
 *                 default: "custom-query"
 *                 example: "custom-query"
 *     responses:
 *       200:
 *         description: AI insight generated and saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/AIInsight'
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Prompt is required"
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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred while processing the request"
 */
geminiRouter.post("/insight", generateInsight);

export default geminiRouter;
