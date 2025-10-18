import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  // Program CRUD
  createProgram,
  getPrograms,
  getProgram,
  updateProgram,
  deleteProgram,
  startProgram,
  completeProgramWorkout,
  // Workout CRUD
  createWorkout,
  getWorkouts,
  getWorkout,
  updateWorkout,
  deleteWorkout,
  completeWorkout,
  // Exercise operations
  addExerciseToWorkout,
  updateExerciseInWorkout,
  removeExerciseFromWorkout,
  // Statistics
  getWorkoutStats,
  // Progress tracking
  createProgress,
  getProgressEntries,
  getProgressEntry,
  updateProgressEntry,
  deleteProgressEntry,
  getProgressStats,
  getProgressTrends,
} from "../controllers/workout.controller.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(protectRoute);

/**
 * @swagger
 * components:
 *   schemas:
 *     Program:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - goal
 *         - difficulty
 *         - duration
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the program
 *         userId:
 *           type: string
 *           description: The user who owns this program
 *         title:
 *           type: string
 *           description: The program title
 *           example: "12-Week Muscle Building Program"
 *         description:
 *           type: string
 *           description: The program description
 *         goal:
 *           type: string
 *           enum: [fat-loss, muscle-gain, endurance, general-fitness, athletic-performance, strength, flexibility]
 *           description: The program goal
 *         difficulty:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           description: The program difficulty level
 *         duration:
 *           type: object
 *           properties:
 *             weeks:
 *               type: number
 *               minimum: 1
 *               maximum: 52
 *             daysPerWeek:
 *               type: number
 *               minimum: 1
 *               maximum: 7
 *         status:
 *           type: string
 *           enum: [draft, active, completed, paused, abandoned]
 *           default: draft
 *         equipmentRequired:
 *           type: array
 *           items:
 *             type: string
 *             enum: [dumbbells, barbell, kettlebell, resistance-bands, pull-up-bar, bench, cardio-machine, bodyweight-only, cable-machine, other]
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         nutrition:
 *           type: object
 *           properties:
 *             includeNutritionPlan:
 *               type: boolean
 *             dailyCalories:
 *               type: number
 *             macros:
 *               type: object
 *               properties:
 *                 protein:
 *                   type: number
 *                 carbs:
 *                   type: number
 *                 fats:
 *                   type: number
 *         notes:
 *           type: string
 *         isPublic:
 *           type: boolean
 *           default: false
 *         progress:
 *           type: object
 *           properties:
 *             completedWorkouts:
 *               type: number
 *             totalWorkouts:
 *               type: number
 *             completionPercentage:
 *               type: number
 *               minimum: 0
 *               maximum: 100
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
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
 *           description: The user who owns this workout
 *         date:
 *           type: string
 *           format: date-time
 *           description: The workout date
 *         type:
 *           type: string
 *           enum: [strength, cardio, hiit, flexibility, sports, mixed]
 *           description: The workout type
 *         title:
 *           type: string
 *           description: The workout title
 *         exercises:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Exercise'
 *         totalDuration:
 *           type: number
 *           description: Total duration in minutes
 *         caloriesBurned:
 *           type: number
 *           default: 0
 *         intensity:
 *           type: string
 *           enum: [low, moderate, high, extreme]
 *           default: moderate
 *         mood:
 *           type: string
 *           enum: [excellent, good, okay, tired, exhausted]
 *         notes:
 *           type: string
 *         isCompleted:
 *           type: boolean
 *           default: false
 *         aiGenerated:
 *           type: boolean
 *           default: false
 *         performanceScore:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Exercise:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The exercise name
 *         sets:
 *           type: number
 *           description: Number of sets
 *         reps:
 *           type: number
 *           description: Number of repetitions
 *         duration:
 *           type: number
 *           description: Duration in seconds
 *         weight:
 *           type: object
 *           properties:
 *             value:
 *               type: number
 *             unit:
 *               type: string
 *               enum: [kg, lbs]
 *         restTime:
 *           type: number
 *           description: Rest time in seconds
 *         notes:
 *           type: string
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *     CreateProgramRequest:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - goal
 *         - difficulty
 *         - duration
 *       properties:
 *         title:
 *           type: string
 *           example: "12-Week Muscle Building Program"
 *         description:
 *           type: string
 *           example: "A comprehensive program designed to build lean muscle mass"
 *         goal:
 *           type: string
 *           enum: [fat-loss, muscle-gain, endurance, general-fitness, athletic-performance, strength, flexibility]
 *           example: muscle-gain
 *         difficulty:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           example: intermediate
 *         duration:
 *           type: object
 *           properties:
 *             weeks:
 *               type: number
 *               example: 12
 *             daysPerWeek:
 *               type: number
 *               example: 4
 *         equipmentRequired:
 *           type: array
 *           items:
 *             type: string
 *           example: [dumbbells, barbell, bench]
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: [hypertrophy, strength]
 *         nutrition:
 *           type: object
 *           properties:
 *             includeNutritionPlan:
 *               type: boolean
 *             dailyCalories:
 *               type: number
 *             macros:
 *               type: object
 *               properties:
 *                 protein:
 *                   type: number
 *                 carbs:
 *                   type: number
 *                 fats:
 *                   type: number
 *         notes:
 *           type: string
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
 *           example: strength
 *         title:
 *           type: string
 *           example: "Upper Body Strength Training"
 *         exercises:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Exercise'
 *         totalDuration:
 *           type: number
 *           example: 60
 *         intensity:
 *           type: string
 *           enum: [low, moderate, high, extreme]
 *           example: moderate
 *         mood:
 *           type: string
 *           enum: [excellent, good, okay, tired, exhausted]
 *         notes:
 *           type: string
 *         aiGenerated:
 *           type: boolean
 *           default: false
 *     CompleteWorkoutRequest:
 *       type: object
 *       properties:
 *         performanceScore:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           example: 85
 *         caloriesBurned:
 *           type: number
 *           example: 450
 *     CompleteProgramWorkoutRequest:
 *       type: object
 *       required:
 *         - weekNumber
 *         - workoutIndex
 *       properties:
 *         weekNumber:
 *           type: number
 *           example: 1
 *         workoutIndex:
 *           type: number
 *           example: 0
 */

// ========== PROGRAM ROUTES ==========

/**
 * @swagger
 * /api/workouts/programs:
 *   post:
 *     summary: Create a new program
 *     description: Create a new workout program for the authenticated user
 *     tags: [Programs]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProgramRequest'
 *     responses:
 *       201:
 *         description: Program created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       example: true
 *                     message:
 *                       example: "Program created successfully"
 *                     data:
 *                       $ref: '#/components/schemas/Program'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 */
router.post("/programs", createProgram);

/**
 * @swagger
 * /api/workouts/programs:
 *   get:
 *     summary: Get all programs for the authenticated user
 *     description: Retrieve all workout programs for the authenticated user with optional filtering
 *     tags: [Programs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, active, completed, paused, abandoned]
 *         description: Filter by program status
 *       - in: query
 *         name: goal
 *         schema:
 *           type: string
 *           enum: [fat-loss, muscle-gain, endurance, general-fitness, athletic-performance, strength, flexibility]
 *         description: Filter by program goal
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         description: Filter by program difficulty
 *     responses:
 *       200:
 *         description: Programs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       example: true
 *                     message:
 *                       example: "Programs retrieved successfully"
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Program'
 *       401:
 *         description: Unauthorized - invalid or missing token
 */
router.get("/programs", getPrograms);

/**
 * @swagger
 * /api/workouts/programs/{programId}:
 *   get:
 *     summary: Get a specific program
 *     description: Retrieve a specific program by ID for the authenticated user
 *     tags: [Programs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: programId
 *         required: true
 *         schema:
 *           type: string
 *         description: The program ID
 *     responses:
 *       200:
 *         description: Program retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       example: true
 *                     message:
 *                       example: "Program retrieved successfully"
 *                     data:
 *                       $ref: '#/components/schemas/Program'
 *       404:
 *         description: Program not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 */
router.get("/programs/:programId", getProgram);

/**
 * @swagger
 * /api/workouts/programs/{programId}:
 *   put:
 *     summary: Update a program
 *     description: Update a specific program for the authenticated user
 *     tags: [Programs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: programId
 *         required: true
 *         schema:
 *           type: string
 *         description: The program ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProgramRequest'
 *     responses:
 *       200:
 *         description: Program updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       example: true
 *                     message:
 *                       example: "Program updated successfully"
 *                     data:
 *                       $ref: '#/components/schemas/Program'
 *       404:
 *         description: Program not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 */
router.put("/programs/:programId", updateProgram);

/**
 * @swagger
 * /api/workouts/programs/{programId}:
 *   delete:
 *     summary: Delete a program
 *     description: Delete a specific program for the authenticated user
 *     tags: [Programs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: programId
 *         required: true
 *         schema:
 *           type: string
 *         description: The program ID
 *     responses:
 *       200:
 *         description: Program deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       example: true
 *                     message:
 *                       example: "Program deleted successfully"
 *                     data:
 *                       example: null
 *       404:
 *         description: Program not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 */
router.delete("/programs/:programId", deleteProgram);

/**
 * @swagger
 * /api/workouts/programs/{programId}/start:
 *   post:
 *     summary: Start a program
 *     description: Start a specific program for the authenticated user
 *     tags: [Programs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: programId
 *         required: true
 *         schema:
 *           type: string
 *         description: The program ID
 *     responses:
 *       200:
 *         description: Program started successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       example: true
 *                     message:
 *                       example: "Program started successfully"
 *                     data:
 *                       $ref: '#/components/schemas/Program'
 *       404:
 *         description: Program not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 */
router.post("/programs/:programId/start", startProgram);

/**
 * @swagger
 * /api/workouts/programs/{programId}/complete-workout:
 *   post:
 *     summary: Complete a workout in a program
 *     description: Mark a specific workout as completed in a program
 *     tags: [Programs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: programId
 *         required: true
 *         schema:
 *           type: string
 *         description: The program ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompleteProgramWorkoutRequest'
 *     responses:
 *       200:
 *         description: Workout completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       example: true
 *                     message:
 *                       example: "Workout completed successfully"
 *                     data:
 *                       $ref: '#/components/schemas/Program'
 *       404:
 *         description: Program not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 */
router.post("/programs/:programId/complete-workout", completeProgramWorkout);

// ========== WORKOUT ROUTES ==========

/**
 * @swagger
 * /api/workouts:
 *   post:
 *     summary: Create a new workout
 *     description: Create a new workout for the authenticated user
 *     tags: [Workouts]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWorkoutRequest'
 *     responses:
 *       201:
 *         description: Workout created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       example: true
 *                     message:
 *                       example: "Workout created successfully"
 *                     data:
 *                       $ref: '#/components/schemas/Workout'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 */
router.post("/", createWorkout);

/**
 * @swagger
 * /api/workouts:
 *   get:
 *     summary: Get all workouts for the authenticated user
 *     description: Retrieve all workouts for the authenticated user with optional filtering
 *     tags: [Workouts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [strength, cardio, hiit, flexibility, sports, mixed]
 *         description: Filter by workout type
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by workout date (from this date onwards)
 *       - in: query
 *         name: isCompleted
 *         schema:
 *           type: boolean
 *         description: Filter by completion status
 *     responses:
 *       200:
 *         description: Workouts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       example: true
 *                     message:
 *                       example: "Workouts retrieved successfully"
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Workout'
 *       401:
 *         description: Unauthorized - invalid or missing token
 */
router.get("/", getWorkouts);

/**
 * @swagger
 * /api/workouts/{workoutId}:
 *   get:
 *     summary: Get a specific workout
 *     description: Retrieve a specific workout by ID for the authenticated user
 *     tags: [Workouts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workout ID
 *     responses:
 *       200:
 *         description: Workout retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       example: true
 *                     message:
 *                       example: "Workout retrieved successfully"
 *                     data:
 *                       $ref: '#/components/schemas/Workout'
 *       404:
 *         description: Workout not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 */
router.get("/:workoutId", getWorkout);

/**
 * @swagger
 * /api/workouts/{workoutId}:
 *   put:
 *     summary: Update a workout
 *     description: Update a specific workout for the authenticated user
 *     tags: [Workouts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workout ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWorkoutRequest'
 *     responses:
 *       200:
 *         description: Workout updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       example: true
 *                     message:
 *                       example: "Workout updated successfully"
 *                     data:
 *                       $ref: '#/components/schemas/Workout'
 *       404:
 *         description: Workout not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 */
router.put("/:workoutId", updateWorkout);

/**
 * @swagger
 * /api/workouts/{workoutId}:
 *   delete:
 *     summary: Delete a workout
 *     description: Delete a specific workout for the authenticated user
 *     tags: [Workouts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workout ID
 *     responses:
 *       200:
 *         description: Workout deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       example: true
 *                     message:
 *                       example: "Workout deleted successfully"
 *                     data:
 *                       example: null
 *       404:
 *         description: Workout not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 */
router.delete("/:workoutId", deleteWorkout);

/**
 * @swagger
 * /api/workouts/{workoutId}/complete:
 *   post:
 *     summary: Complete a workout
 *     description: Mark a specific workout as completed with optional performance data
 *     tags: [Workouts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workout ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompleteWorkoutRequest'
 *     responses:
 *       200:
 *         description: Workout completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       example: true
 *                     message:
 *                       example: "Workout completed successfully"
 *                     data:
 *                       $ref: '#/components/schemas/Workout'
 *       404:
 *         description: Workout not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 */
router.post("/:workoutId/complete", completeWorkout);

// ========== EXERCISE ROUTES ==========

/**
 * @swagger
 * /api/workouts/{workoutId}/exercises:
 *   post:
 *     summary: Add exercise to workout
 *     description: Add a new exercise to a specific workout
 *     tags: [Exercises]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workout ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Exercise'
 *     responses:
 *       200:
 *         description: Exercise added successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       example: true
 *                     message:
 *                       example: "Exercise added successfully"
 *                     data:
 *                       $ref: '#/components/schemas/Workout'
 *       404:
 *         description: Workout not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 */
router.post("/:workoutId/exercises", addExerciseToWorkout);

/**
 * @swagger
 * /api/workouts/{workoutId}/exercises/{exerciseIndex}:
 *   put:
 *     summary: Update exercise in workout
 *     description: Update a specific exercise in a workout
 *     tags: [Exercises]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workout ID
 *       - in: path
 *         name: exerciseIndex
 *         required: true
 *         schema:
 *           type: integer
 *         description: The exercise index in the workout
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Exercise'
 *     responses:
 *       200:
 *         description: Exercise updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       example: true
 *                     message:
 *                       example: "Exercise updated successfully"
 *                     data:
 *                       $ref: '#/components/schemas/Workout'
 *       404:
 *         description: Workout or exercise not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 */
router.put("/:workoutId/exercises/:exerciseIndex", updateExerciseInWorkout);

/**
 * @swagger
 * /api/workouts/{workoutId}/exercises/{exerciseIndex}:
 *   delete:
 *     summary: Remove exercise from workout
 *     description: Remove a specific exercise from a workout
 *     tags: [Exercises]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workout ID
 *       - in: path
 *         name: exerciseIndex
 *         required: true
 *         schema:
 *           type: integer
 *         description: The exercise index in the workout
 *     responses:
 *       200:
 *         description: Exercise removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       example: true
 *                     message:
 *                       example: "Exercise removed successfully"
 *                     data:
 *                       $ref: '#/components/schemas/Workout'
 *       404:
 *         description: Workout or exercise not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 */
router.delete(
  "/:workoutId/exercises/:exerciseIndex",
  removeExerciseFromWorkout
);

// ========== STATISTICS ROUTES ==========

/**
 * @swagger
 * /api/workouts/stats:
 *   get:
 *     summary: Get workout statistics
 *     description: Get workout statistics for the authenticated user
 *     tags: [Statistics]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           default: "30"
 *         description: Number of days to include in statistics
 *     responses:
 *       200:
 *         description: Workout statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       example: true
 *                     message:
 *                       example: "Workout statistics retrieved successfully"
 *                     data:
 *                       type: object
 *                       properties:
 *                         totalWorkouts:
 *                           type: number
 *                           example: 15
 *                         completedWorkouts:
 *                           type: number
 *                           example: 12
 *                         totalDuration:
 *                           type: number
 *                           example: 900
 *                         totalCalories:
 *                           type: number
 *                           example: 5400
 *                         avgPerformance:
 *                           type: number
 *                           example: 85.5
 *       401:
 *         description: Unauthorized - invalid or missing token
 */
router.get("/stats", getWorkoutStats);

// ========== PROGRESS TRACKING ROUTES ==========

/**
 * @swagger
 * /api/workouts/progress:
 *   post:
 *     summary: Create a new progress entry
 *     description: Create a new progress tracking entry for the authenticated user
 *     tags: [Progress]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: The date of the progress entry
 *               weight:
 *                 type: object
 *                 properties:
 *                   value:
 *                     type: number
 *                     example: 75.5
 *                   unit:
 *                     type: string
 *                     enum: [kg, lbs]
 *                     example: "kg"
 *               bodyFatPercentage:
 *                 type: number
 *                 example: 15.2
 *               measurements:
 *                 type: object
 *                 properties:
 *                   chest:
 *                     type: number
 *                     example: 100
 *                   waist:
 *                     type: number
 *                     example: 85
 *                   hips:
 *                     type: number
 *                     example: 95
 *                   thighs:
 *                     type: number
 *                     example: 60
 *                   arms:
 *                     type: number
 *                     example: 35
 *                   unit:
 *                     type: string
 *                     enum: [cm, inches]
 *                     example: "cm"
 *               photos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: "https://res.cloudinary.com/example/image.jpg"
 *                     type:
 *                       type: string
 *                       enum: [front, side, back]
 *                       example: "front"
 *               strengthBenchmarks:
 *                 type: object
 *                 properties:
 *                   benchPress:
 *                     type: number
 *                     example: 100
 *                   squat:
 *                     type: number
 *                     example: 150
 *                   deadlift:
 *                     type: number
 *                     example: 180
 *                   pullUps:
 *                     type: number
 *                     example: 12
 *                   pushUps:
 *                     type: number
 *                     example: 25
 *               cardioMetrics:
 *                 type: object
 *                 properties:
 *                   restingHeartRate:
 *                     type: number
 *                     example: 65
 *                   vo2Max:
 *                     type: number
 *                     example: 45
 *                   runningPace:
 *                     type: number
 *                     example: 5.5
 *               notes:
 *                 type: string
 *                 example: "Feeling strong today!"
 *     responses:
 *       201:
 *         description: Progress entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       example: true
 *                     message:
 *                       example: "Progress entry created successfully"
 *                     data:
 *                       $ref: '#/components/schemas/Progress'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/progress", createProgress);

/**
 * @swagger
 * /api/workouts/progress:
 *   get:
 *     summary: Get user progress entries
 *     description: Retrieve all progress entries for the authenticated user with optional filtering and pagination
 *     tags: [Progress]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of progress entries per page
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (ISO 8601 format)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (ISO 8601 format)
 *     responses:
 *       200:
 *         description: Progress entries retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       example: true
 *                     message:
 *                       example: "Progress entries retrieved successfully"
 *                     data:
 *                       type: object
 *                       properties:
 *                         progressEntries:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Progress'
 *                         pagination:
 *                           type: object
 *                           properties:
 *                             current:
 *                               type: integer
 *                               example: 1
 *                             pages:
 *                               type: integer
 *                               example: 5
 *                             total:
 *                               type: integer
 *                               example: 50
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/progress", getProgressEntries);

/**
 * @swagger
 * /api/workouts/progress/stats:
 *   get:
 *     summary: Get progress statistics
 *     description: Retrieve progress statistics and analytics for the authenticated user
 *     tags: [Progress]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (ISO 8601 format)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (ISO 8601 format)
 *     responses:
 *       200:
 *         description: Progress statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       example: true
 *                     message:
 *                       example: "Progress statistics retrieved successfully"
 *                     data:
 *                       type: object
 *                       properties:
 *                         totalEntries:
 *                           type: integer
 *                           example: 25
 *                         latestWeight:
 *                           type: number
 *                           example: 75.5
 *                         earliestWeight:
 *                           type: number
 *                           example: 80.0
 *                         avgBodyFat:
 *                           type: number
 *                           example: 15.2
 *                         weightChange:
 *                           type: number
 *                           example: -4.5
 *                         avgBenchPress:
 *                           type: number
 *                           example: 100.5
 *                         avgSquat:
 *                           type: number
 *                           example: 150.0
 *                         avgDeadlift:
 *                           type: number
 *                           example: 180.0
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/progress/stats", getProgressStats);

/**
 * @swagger
 * /api/workouts/progress/trends:
 *   get:
 *     summary: Get progress trends
 *     description: Retrieve progress trends over time for the authenticated user
 *     tags: [Progress]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (ISO 8601 format)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (ISO 8601 format)
 *       - in: query
 *         name: metric
 *         schema:
 *           type: string
 *           enum: [weight, bodyFat, benchPress, squat, deadlift, pullUps, pushUps, restingHR, vo2Max]
 *         description: Specific metric to track trends for
 *     responses:
 *       200:
 *         description: Progress trends retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       example: true
 *                     message:
 *                       example: "Progress trends retrieved successfully"
 *                     data:
 *                       type: object
 *                       properties:
 *                         trends:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               date:
 *                                 type: string
 *                                 format: date-time
 *                               value:
 *                                 type: number
 *                         metric:
 *                           type: string
 *                           example: "weight"
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/progress/trends", getProgressTrends);

/**
 * @swagger
 * /api/workouts/progress/{id}:
 *   get:
 *     summary: Get progress entry by ID
 *     description: Retrieve a specific progress entry by its ID
 *     tags: [Progress]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The progress entry ID
 *     responses:
 *       200:
 *         description: Progress entry retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       example: true
 *                     message:
 *                       example: "Progress entry retrieved successfully"
 *                     data:
 *                       $ref: '#/components/schemas/Progress'
 *       400:
 *         description: Bad request - invalid progress entry ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Progress entry not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/progress/:id", getProgressEntry);

/**
 * @swagger
 * /api/workouts/progress/{id}:
 *   put:
 *     summary: Update progress entry
 *     description: Update a specific progress entry by its ID
 *     tags: [Progress]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The progress entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               weight:
 *                 type: object
 *                 properties:
 *                   value:
 *                     type: number
 *                   unit:
 *                     type: string
 *                     enum: [kg, lbs]
 *               bodyFatPercentage:
 *                 type: number
 *               measurements:
 *                 type: object
 *                 properties:
 *                   chest:
 *                     type: number
 *                   waist:
 *                     type: number
 *                   hips:
 *                     type: number
 *                   thighs:
 *                     type: number
 *                   arms:
 *                     type: number
 *                   unit:
 *                     type: string
 *                     enum: [cm, inches]
 *               photos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                     type:
 *                       type: string
 *                       enum: [front, side, back]
 *               strengthBenchmarks:
 *                 type: object
 *                 properties:
 *                   benchPress:
 *                     type: number
 *                   squat:
 *                     type: number
 *                   deadlift:
 *                     type: number
 *                   pullUps:
 *                     type: number
 *                   pushUps:
 *                     type: number
 *               cardioMetrics:
 *                 type: object
 *                 properties:
 *                   restingHeartRate:
 *                     type: number
 *                   vo2Max:
 *                     type: number
 *                   runningPace:
 *                     type: number
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Progress entry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       example: true
 *                     message:
 *                       example: "Progress entry updated successfully"
 *                     data:
 *                       $ref: '#/components/schemas/Progress'
 *       400:
 *         description: Bad request - invalid progress entry ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Progress entry not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/progress/:id", updateProgressEntry);

/**
 * @swagger
 * /api/workouts/progress/{id}:
 *   delete:
 *     summary: Delete progress entry
 *     description: Delete a specific progress entry by its ID
 *     tags: [Progress]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The progress entry ID
 *     responses:
 *       200:
 *         description: Progress entry deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       example: true
 *                     message:
 *                       example: "Progress entry deleted successfully"
 *                     data:
 *                       example: null
 *       400:
 *         description: Bad request - invalid progress entry ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Progress entry not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/progress/:id", deleteProgressEntry);

export default router;
