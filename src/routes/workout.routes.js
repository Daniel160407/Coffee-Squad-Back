import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  createWorkoutCard,
  getWorkoutCards,
} from "../controllers/workout.controller.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Exercise:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the exercise
 *           example: "Push-ups"
 *         sets:
 *           type: number
 *           description: Number of sets
 *           example: 3
 *         reps:
 *           type: number
 *           description: Number of repetitions
 *           example: 15
 *         duration:
 *           type: number
 *           description: Duration in minutes
 *           example: 5
 *         weight:
 *           type: object
 *           properties:
 *             value:
 *               type: number
 *               example: 50
 *             unit:
 *               type: string
 *               example: "kg"
 *         restTime:
 *           type: number
 *           description: Rest time in seconds
 *           example: 60
 *         notes:
 *           type: string
 *           example: "Focus on proper form"
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *           example: "medium"
 *     Workout:
 *       type: object
 *       required:
 *         - type
 *         - title
 *         - totalDuration
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the workout
 *         userId:
 *           type: string
 *           description: The user ID who created the workout
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date when the workout was performed
 *         type:
 *           type: string
 *           enum: [strength, cardio, hiit, flexibility, sports, mixed]
 *           description: Type of workout
 *           example: "strength"
 *         title:
 *           type: string
 *           description: Title of the workout
 *           example: "Morning Strength Training"
 *         exercises:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Exercise'
 *         totalDuration:
 *           type: number
 *           description: Total duration in minutes
 *           example: 45
 *         caloriesBurned:
 *           type: number
 *           description: Calories burned during the workout
 *           example: 300
 *         performanceScore:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Performance score out of 100
 *           example: 85
 *         pace:
 *           type: string
 *           description: Pace of the workout
 *           example: "moderate"
 *         notes:
 *           type: string
 *           description: Additional notes about the workout
 *           example: "Felt strong today"
 *         distance:
 *           type: number
 *           description: Distance covered (for cardio workouts)
 *           example: 5.2
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the workout was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the workout was last updated
 *     CreateWorkoutRequest:
 *       type: object
 *       required:
 *         - type
 *         - title
 *         - totalDuration
 *       properties:
 *         type:
 *           type: string
 *           enum: [strength, cardio, hiit, flexibility, sports, mixed]
 *           description: Type of workout
 *           example: "strength"
 *         title:
 *           type: string
 *           description: Title of the workout
 *           example: "Morning Strength Training"
 *         totalDuration:
 *           type: number
 *           description: Total duration in minutes
 *           example: 45
 *         caloriesBurned:
 *           type: number
 *           description: Calories burned during the workout
 *           example: 300
 *         pace:
 *           type: string
 *           description: Pace of the workout
 *           example: "moderate"
 *         notes:
 *           type: string
 *           description: Additional notes about the workout
 *           example: "Felt strong today"
 *         distance:
 *           type: number
 *           description: Distance covered (for cardio workouts)
 *           example: 5.2
 *         exercises:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Exercise'
 */

router.use(protectRoute);

/**
 * @swagger
 * /api/workout/getcards:
 *   get:
 *     summary: Get all workout cards
 *     description: Retrieve all workout cards from the database
 *     tags: [Workout]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Workout cards retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Bad request - error retrieving workout cards
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/getcards", getWorkoutCards);

/**
 * @swagger
 * /api/workout/createcard:
 *   post:
 *     summary: Create a new workout card
 *     description: Create a new workout card with the provided details
 *     tags: [Workout]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWorkoutRequest'
 *           example:
 *             type: "strength"
 *             title: "Morning Strength Training"
 *             totalDuration: 45
 *             caloriesBurned: 300
 *             pace: "moderate"
 *             notes: "Felt strong today"
 *             distance: 0
 *     responses:
 *       201:
 *         description: Workout card created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Bad request - validation error or creation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/createcard", createWorkoutCard);

export default router;
