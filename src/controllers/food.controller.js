import Meal from "../models/meal.model.js";
import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Meal:
 *       type: object
 *       required:
 *         - userId
 *         - mealType
 *         - name
 *         - calories
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the meal
 *         userId:
 *           type: string
 *           description: The user's ID who owns this meal
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date and time of the meal
 *         mealType:
 *           type: string
 *           enum: [breakfast, lunch, dinner, snack]
 *           description: The type of meal
 *         name:
 *           type: string
 *           description: The name of the meal
 *         foods:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: number
 *               unit:
 *                 type: string
 *           description: Array of foods in the meal
 *         calories:
 *           type: number
 *           description: Total calories in the meal
 *         macros:
 *           type: object
 *           properties:
 *             protein:
 *               type: number
 *             carbs:
 *               type: number
 *             fats:
 *               type: number
 *         micronutrients:
 *           type: object
 *           properties:
 *             fiber:
 *               type: number
 *             sugar:
 *               type: number
 *             sodium:
 *               type: number
 *             cholesterol:
 *               type: number
 *         imageUrl:
 *           type: string
 *           description: Cloudinary URL for meal photo
 *         recipeUrl:
 *           type: string
 *           description: Link to recipe if AI-suggested
 *         aiGenerated:
 *           type: boolean
 *           description: Whether the meal was AI-generated
 *         notes:
 *           type: string
 *           description: Additional notes about the meal
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the meal was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the meal was last updated
 */

// Create a new meal
export const createMeal = async (req, res) => {
  try {
    const {
      mealType,
      name,
      foods,
      calories,
      macros,
      micronutrients,
      imageUrl,
      recipeUrl,
      aiGenerated,
      notes,
    } = req.body;

    const userId = req.user.id;

    const meal = new Meal({
      userId,
      mealType,
      name,
      foods,
      calories,
      macros,
      micronutrients,
      imageUrl,
      recipeUrl,
      aiGenerated,
      notes,
    });

    await meal.save();

    res.status(201).json({
      success: true,
      message: "Meal created successfully",
      data: meal,
    });
  } catch (error) {
    console.error("Error creating meal:", error);
    res.status(500).json({
      success: false,
      message: "Error creating meal",
      data: null,
    });
  }
};

// Get all meals for a user
export const getUserMeals = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, mealType, startDate, endDate } = req.query;

    const query = { userId };

    // Filter by meal type if provided
    if (mealType) {
      query.mealType = mealType;
    }

    // Filter by date range if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const meals = await Meal.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Meal.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Meals retrieved successfully",
      data: {
        meals,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    console.error("Error getting user meals:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving meals",
      data: null,
    });
  }
};

// Get a specific meal by ID
export const getMealById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid meal ID",
        data: null,
      });
    }

    const meal = await Meal.findOne({ _id: id, userId });

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Meal not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Meal retrieved successfully",
      data: meal,
    });
  } catch (error) {
    console.error("Error getting meal:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving meal",
      data: null,
    });
  }
};

// Update a meal
export const updateMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid meal ID",
        data: null,
      });
    }

    const meal = await Meal.findOneAndUpdate({ _id: id, userId }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Meal not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Meal updated successfully",
      data: meal,
    });
  } catch (error) {
    console.error("Error updating meal:", error);
    res.status(500).json({
      success: false,
      message: "Error updating meal",
      data: null,
    });
  }
};

// Delete a meal
export const deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid meal ID",
        data: null,
      });
    }

    const meal = await Meal.findOneAndDelete({ _id: id, userId });

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Meal not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Meal deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Error deleting meal:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting meal",
      data: null,
    });
  }
};

// Get meal statistics for a user
export const getMealStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    const query = { userId };

    // Filter by date range if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const stats = await Meal.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalMeals: { $sum: 1 },
          totalCalories: { $sum: "$calories" },
          avgCalories: { $avg: "$calories" },
          totalProtein: { $sum: "$macros.protein" },
          totalCarbs: { $sum: "$macros.carbs" },
          totalFats: { $sum: "$macros.fats" },
          mealTypes: {
            $push: "$mealType",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalMeals: 1,
          totalCalories: 1,
          avgCalories: { $round: ["$avgCalories", 2] },
          totalProtein: 1,
          totalCarbs: 1,
          totalFats: 1,
          mealTypeCounts: {
            breakfast: {
              $size: {
                $filter: {
                  input: "$mealTypes",
                  cond: { $eq: ["$$this", "breakfast"] },
                },
              },
            },
            lunch: {
              $size: {
                $filter: {
                  input: "$mealTypes",
                  cond: { $eq: ["$$this", "lunch"] },
                },
              },
            },
            dinner: {
              $size: {
                $filter: {
                  input: "$mealTypes",
                  cond: { $eq: ["$$this", "dinner"] },
                },
              },
            },
            snack: {
              $size: {
                $filter: {
                  input: "$mealTypes",
                  cond: { $eq: ["$$this", "snack"] },
                },
              },
            },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Meal statistics retrieved successfully",
      data: stats[0] || {
        totalMeals: 0,
        totalCalories: 0,
        avgCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFats: 0,
        mealTypeCounts: {
          breakfast: 0,
          lunch: 0,
          dinner: 0,
          snack: 0,
        },
      },
    });
  } catch (error) {
    console.error("Error getting meal statistics:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving meal statistics",
      data: null,
    });
  }
};
