import express from "express";
import { generateText } from "../controllers/gemini.controller.js";

const geminiRouter = express.Router();

/**
 * @swagger
 * /api/gemini:
 *   post:
 *     summary: Generate text using Gemini AI
 *     description: Send a prompt to Gemini AI and receive generated text response
 *     tags: [Gemini AI]
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
 *                 description: The text prompt to send to Gemini AI
 *                 example: "Write a short story about a robot learning to paint"
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
 *                 text:
 *                   type: string
 *                   description: Generated text from Gemini AI
 *                   example: "Once upon a time, in a small workshop..."
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T10:30:00.000Z"
 *       400:
 *         description: Bad request - missing prompt
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
geminiRouter.post("/", generateText);

export default geminiRouter;
