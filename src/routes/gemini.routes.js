import express from "express";
import {
  generateInsight,
  getQuickReplies,
} from "../controllers/gemini.controller.js";

const geminiRouter = express.Router();

/**
 * @swagger
 * /api/gemini/insight:
 *   post:
 *     summary: Generate AI insight using Gemini AI
 *     description: Send a prompt to Gemini AI and receive structured insight response with recommendations and quick replies
 *     tags: [Gemini AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: The text prompt to send to Gemini AI (required if quickReplyPayload not provided)
 *                 example: "Analyze my workout performance and give me recommendations"
 *               quickReplyPayload:
 *                 type: string
 *                 description: The payload of a quick reply button that was clicked (required if prompt not provided)
 *                 example: "GET_WORKOUT_PLAN"
 *               userId:
 *                 type: string
 *                 description: The ID of the user requesting the insight
 *                 example: "507f1f77bcf86cd799439011"
 *               insightType:
 *                 type: string
 *                 description: Type of insight being requested
 *                 enum: [daily-summary, weekly-summary, monthly-summary, performance-analysis, nutrition-feedback, recommendation, custom-query]
 *                 default: custom-query
 *                 example: "performance-analysis"
 *     responses:
 *       200:
 *         description: Successful response from Gemini AI
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439012"
 *                     userId:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     title:
 *                       type: string
 *                       example: "Workout Performance Analysis"
 *                     summary:
 *                       type: string
 *                       example: "Your workout performance has improved significantly..."
 *                     recommendations:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           category:
 *                             type: string
 *                             example: "workout"
 *                           text:
 *                             type: string
 *                             example: "Increase cardio intensity by 10%"
 *                           priority:
 *                             type: string
 *                             enum: [low, medium, high]
 *                             example: "medium"
 *                     quickReplies:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           text:
 *                             type: string
 *                             example: "Create Upper Body Focus Plan"
 *                           payload:
 *                             type: string
 *                             example: "CREATE_UPPER_BODY_PLAN"
 *                           category:
 *                             type: string
 *                             example: "workout"
 *                           description:
 *                             type: string
 *                             example: "Generate a specialized upper body workout routine"
 *                     insightType:
 *                       type: string
 *                       example: "performance-analysis"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T10:30:00.000Z"
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
 *                   example: "Either prompt or quickReplyPayload is required"
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
 *                   example: "Failed to generate structured AI insight."
 */

/**
 * @swagger
 * /api/gemini/quick-replies:
 *   get:
 *     summary: Get quick replies configuration for frontend
 *     description: Retrieve all available quick reply options with their display text and categories
 *     tags: [Gemini AI]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [workout, nutrition, recovery, tips, analytics]
 *         description: Filter quick replies by category
 *         example: "workout"
 *     responses:
 *       200:
 *         description: Successful response with quick replies configuration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     quickReplies:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "GET_WORKOUT_PLAN"
 *                           text:
 *                             type: string
 *                             example: "Get My Workout Plan"
 *                           category:
 *                             type: string
 *                             example: "workout"
 *                           description:
 *                             type: string
 *                             example: "Generate a personalized workout plan based on your goals"
 *                     total:
 *                       type: number
 *                       example: 5
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["workout", "nutrition", "recovery", "tips", "analytics"]
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
 *                   example: "Failed to get quick replies configuration"
 */
geminiRouter.post("/insight", generateInsight);
geminiRouter.get("/quick-replies", getQuickReplies);

export default geminiRouter;
