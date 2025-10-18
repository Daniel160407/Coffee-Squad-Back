import { Router } from "express";
import {
  createMeal,
  getUserMeals,
  getMealById,
  updateMeal,
  deleteMeal,
  getMealStats,
} from "../controllers/food.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/food:
 *   post:
 *     summary: Create a new meal
 *     description: Create a new meal entry for the authenticated user
 *     tags: [Food]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mealType
 *               - name
 *               - calories
 *             properties:
 *               mealType:
 *                 type: string
 *                 enum: [breakfast, lunch, dinner, snack]
 *                 description: The type of meal
 *                 example: "breakfast"
 *               name:
 *                 type: string
 *                 description: The name of the meal
 *                 example: "Oatmeal with berries"
 *               foods:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Oats"
 *                     quantity:
 *                       type: number
 *                       example: 50
 *                     unit:
 *                       type: string
 *                       example: "grams"
 *                 description: Array of foods in the meal
 *               calories:
 *                 type: number
 *                 description: Total calories in the meal
 *                 example: 300
 *               macros:
 *                 type: object
 *                 properties:
 *                   protein:
 *                     type: number
 *                     example: 10
 *                   carbs:
 *                     type: number
 *                     example: 50
 *                   fats:
 *                     type: number
 *                     example: 5
 *               micronutrients:
 *                 type: object
 *                 properties:
 *                   fiber:
 *                     type: number
 *                     example: 8
 *                   sugar:
 *                     type: number
 *                     example: 15
 *                   sodium:
 *                     type: number
 *                     example: 200
 *                   cholesterol:
 *                     type: number
 *                     example: 0
 *               imageUrl:
 *                 type: string
 *                 description: Cloudinary URL for meal photo
 *                 example: "https://res.cloudinary.com/example/image.jpg"
 *               recipeUrl:
 *                 type: string
 *                 description: Link to recipe if AI-suggested
 *                 example: "https://example.com/recipe"
 *               aiGenerated:
 *                 type: boolean
 *                 description: Whether the meal was AI-generated
 *                 example: false
 *               notes:
 *                 type: string
 *                 description: Additional notes about the meal
 *                 example: "Added extra berries for sweetness"
 *     responses:
 *       201:
 *         description: Meal created successfully
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
 *                       example: "Meal created successfully"
 *                     data:
 *                       $ref: '#/components/schemas/Meal'
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
router.post("/", protectRoute, createMeal);

/**
 * @swagger
 * /api/food:
 *   get:
 *     summary: Get user meals
 *     description: Retrieve all meals for the authenticated user with optional filtering and pagination
 *     tags: [Food]
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
 *         description: Number of meals per page
 *       - in: query
 *         name: mealType
 *         schema:
 *           type: string
 *           enum: [breakfast, lunch, dinner, snack]
 *         description: Filter by meal type
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
 *         description: Meals retrieved successfully
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
 *                       example: "Meals retrieved successfully"
 *                     data:
 *                       type: object
 *                       properties:
 *                         meals:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Meal'
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
router.get("/", protectRoute, getUserMeals);

/**
 * @swagger
 * /api/food/stats:
 *   get:
 *     summary: Get meal statistics
 *     description: Retrieve meal statistics for the authenticated user
 *     tags: [Food]
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
 *         description: Meal statistics retrieved successfully
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
 *                       example: "Meal statistics retrieved successfully"
 *                     data:
 *                       type: object
 *                       properties:
 *                         totalMeals:
 *                           type: integer
 *                           example: 25
 *                         totalCalories:
 *                           type: number
 *                           example: 7500
 *                         avgCalories:
 *                           type: number
 *                           example: 300
 *                         totalProtein:
 *                           type: number
 *                           example: 250
 *                         totalCarbs:
 *                           type: number
 *                           example: 800
 *                         totalFats:
 *                           type: number
 *                           example: 200
 *                         mealTypeCounts:
 *                           type: object
 *                           properties:
 *                             breakfast:
 *                               type: integer
 *                               example: 8
 *                             lunch:
 *                               type: integer
 *                               example: 7
 *                             dinner:
 *                               type: integer
 *                               example: 7
 *                             snack:
 *                               type: integer
 *                               example: 3
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
router.get("/stats", protectRoute, getMealStats);

/**
 * @swagger
 * /api/food/{id}:
 *   get:
 *     summary: Get meal by ID
 *     description: Retrieve a specific meal by its ID
 *     tags: [Food]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The meal ID
 *     responses:
 *       200:
 *         description: Meal retrieved successfully
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
 *                       example: "Meal retrieved successfully"
 *                     data:
 *                       $ref: '#/components/schemas/Meal'
 *       400:
 *         description: Bad request - invalid meal ID
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
 *         description: Meal not found
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
router.get("/:id", protectRoute, getMealById);

/**
 * @swagger
 * /api/food/{id}:
 *   put:
 *     summary: Update meal
 *     description: Update a specific meal by its ID
 *     tags: [Food]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The meal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mealType:
 *                 type: string
 *                 enum: [breakfast, lunch, dinner, snack]
 *               name:
 *                 type: string
 *               foods:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     unit:
 *                       type: string
 *               calories:
 *                 type: number
 *               macros:
 *                 type: object
 *                 properties:
 *                   protein:
 *                     type: number
 *                   carbs:
 *                     type: number
 *                   fats:
 *                     type: number
 *               micronutrients:
 *                 type: object
 *                 properties:
 *                   fiber:
 *                     type: number
 *                   sugar:
 *                     type: number
 *                   sodium:
 *                     type: number
 *                   cholesterol:
 *                     type: number
 *               imageUrl:
 *                 type: string
 *               recipeUrl:
 *                 type: string
 *               aiGenerated:
 *                 type: boolean
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Meal updated successfully
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
 *                       example: "Meal updated successfully"
 *                     data:
 *                       $ref: '#/components/schemas/Meal'
 *       400:
 *         description: Bad request - invalid meal ID
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
 *         description: Meal not found
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
router.put("/:id", protectRoute, updateMeal);

/**
 * @swagger
 * /api/food/{id}:
 *   delete:
 *     summary: Delete meal
 *     description: Delete a specific meal by its ID
 *     tags: [Food]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The meal ID
 *     responses:
 *       200:
 *         description: Meal deleted successfully
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
 *                       example: "Meal deleted successfully"
 *                     data:
 *                       example: null
 *       400:
 *         description: Bad request - invalid meal ID
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
 *         description: Meal not found
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
router.delete("/:id", protectRoute, deleteMeal);

export default router;
