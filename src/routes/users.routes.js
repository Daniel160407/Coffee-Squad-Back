import { Router } from "express";
const usersRouter = Router();
import { getUsers, updateUserStats } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

import {
  deleteExistingUser,
  getUserInfo,
} from "../controllers/user.controller.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User's unique identifier
 *         name:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         age:
 *           type: number
 *           description: User's age
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           description: User's gender
 *         height:
 *           type: number
 *           description: User's height in cm
 *         currentWeight:
 *           type: number
 *           description: User's current weight in kg
 *         targetWeight:
 *           type: number
 *           description: User's target weight in kg
 *         fitnessGoal:
 *           type: string
 *           enum: [weight_loss, weight_gain, muscle_building, endurance, general_fitness]
 *           description: User's fitness goal
 *         activityLevel:
 *           type: string
 *           enum: [sedentary, lightly_active, moderately_active, very_active, extremely_active]
 *           description: User's activity level
 *         availableEquipment:
 *           type: array
 *           items:
 *             type: string
 *           description: Available equipment for workouts
 *         dietaryPreference:
 *           type: string
 *           enum: [omnivore, vegetarian, vegan, pescatarian, keto, paleo]
 *           description: User's dietary preference
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: User creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: User last update timestamp
 *
 *     UserStatsUpdate:
 *       type: object
 *       properties:
 *         age:
 *           type: number
 *           description: User's age
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           description: User's gender
 *         height:
 *           type: number
 *           description: User's height in cm
 *         currentWeight:
 *           type: number
 *           description: User's current weight in kg
 *         targetWeight:
 *           type: number
 *           description: User's target weight in kg
 *         fitnessGoal:
 *           type: string
 *           enum: [weight_loss, weight_gain, muscle_building, endurance, general_fitness]
 *           description: User's fitness goal
 *         activityLevel:
 *           type: string
 *           enum: [sedentary, lightly_active, moderately_active, very_active, extremely_active]
 *           description: User's activity level
 *         availableEquipment:
 *           type: array
 *           items:
 *             type: string
 *           description: Available equipment for workouts
 *         dietaryPreference:
 *           type: string
 *           enum: [omnivore, vegetarian, vegan, pescatarian, keto, paleo]
 *           description: User's dietary preference
 *
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the request was successful
 *         message:
 *           type: string
 *           description: Response message
 *         data:
 *           type: object
 *           description: Response data
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           description: Error message
 *         data:
 *           type: object
 *           description: Error details
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users in the system
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
usersRouter.get("/", getUsers);

/**
 * @swagger
 * /api/users/getuserinfo:
 *   get:
 *     summary: Get current user information
 *     description: Retrieve information about the currently authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user information
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
usersRouter.get("/getuserinfo", protectRoute, getUserInfo);

/**
 * @swagger
 * /api/users/delete/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user by their ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: null
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
usersRouter.delete("/delete/:id", protectRoute, deleteExistingUser);

/**
 * @swagger
 * /api/users/updatestats/{id}:
 *   put:
 *     summary: Update user statistics
 *     description: Update user's fitness statistics and preferences
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserStatsUpdate'
 *           example:
 *             age: 25
 *             gender: "male"
 *             height: 175
 *             currentWeight: 70
 *             targetWeight: 65
 *             fitnessGoal: "weight_loss"
 *             activityLevel: "moderately_active"
 *             availableEquipment: ["dumbbells", "resistance_bands"]
 *             dietaryPreference: "vegetarian"
 *     responses:
 *       200:
 *         description: User statistics successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
usersRouter.put("/updatestats/:id", protectRoute, updateUserStats);

export default usersRouter;
