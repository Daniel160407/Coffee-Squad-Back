import mongoose from "mongoose";
import Program from "../models/program.model.js";
import Workout from "../models/workout.model.js";

// ========== PROGRAM CRUD OPERATIONS ==========

// Create a new program
export async function createProgram(req, res) {
  try {
    const {
      title,
      description,
      goal,
      difficulty,
      duration,
      equipmentRequired,
      tags,
      nutrition,
      notes,
    } = req.body;
    const userId = req.user.id;

    const program = new Program({
      userId,
      title,
      description,
      goal,
      difficulty,
      duration,
      equipmentRequired,
      tags,
      nutrition,
      notes,
    });

    await program.save();

    res.status(201).json({
      success: true,
      message: "Program created successfully",
      data: program,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

// Get all programs for a user
export async function getPrograms(req, res) {
  try {
    const userId = req.user.id;
    const { status, goal, difficulty } = req.query;

    let query = { userId };

    if (status) query.status = status;
    if (goal) query.goal = goal;
    if (difficulty) query.difficulty = difficulty;

    const programs = await Program.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Programs retrieved successfully",
      data: programs,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

// Get a specific program
export async function getProgram(req, res) {
  try {
    const { programId } = req.params;
    const userId = req.user.id;

    const program = await Program.findOne({ _id: programId, userId }).populate(
      "userId",
      "name email"
    );

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Program retrieved successfully",
      data: program,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

// Update a program
export async function updateProgram(req, res) {
  try {
    const { programId } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    const program = await Program.findOneAndUpdate(
      { _id: programId, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Program updated successfully",
      data: program,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

// Delete a program
export async function deleteProgram(req, res) {
  try {
    const { programId } = req.params;
    const userId = req.user.id;

    const program = await Program.findOneAndDelete({ _id: programId, userId });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Program deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

// Start a program
export async function startProgram(req, res) {
  try {
    const { programId } = req.params;
    const userId = req.user.id;

    const program = await Program.findOne({ _id: programId, userId });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
        data: null,
      });
    }

    program.startProgram();
    await program.save();

    res.status(200).json({
      success: true,
      message: "Program started successfully",
      data: program,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

// Complete a workout in a program
export async function completeProgramWorkout(req, res) {
  try {
    const { programId } = req.params;
    const { weekNumber, workoutIndex } = req.body;
    const userId = req.user.id;

    const program = await Program.findOne({ _id: programId, userId });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
        data: null,
      });
    }

    program.completeWorkout(weekNumber, workoutIndex);
    await program.save();

    res.status(200).json({
      success: true,
      message: "Workout completed successfully",
      data: program,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

// ========== WORKOUT CRUD OPERATIONS ==========

// Create a new workout
export async function createWorkout(req, res) {
  try {
    const {
      type,
      title,
      exercises,
      totalDuration,
      intensity,
      mood,
      notes,
      aiGenerated,
    } = req.body;
    const userId = req.user.id;

    const workout = new Workout({
      userId,
      type,
      title,
      exercises,
      totalDuration,
      intensity,
      mood,
      notes,
      aiGenerated,
    });

    await workout.save();

    res.status(201).json({
      success: true,
      message: "Workout created successfully",
      data: workout,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

// Get all workouts for a user
export async function getWorkouts(req, res) {
  try {
    const userId = req.user.id;
    const { type, date, isCompleted } = req.query;

    let query = { userId };

    if (type) query.type = type;
    if (date) query.date = { $gte: new Date(date) };
    if (isCompleted !== undefined) query.isCompleted = isCompleted === "true";

    const workouts = await Workout.find(query)
      .populate("userId", "name email")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      message: "Workouts retrieved successfully",
      data: workouts,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

// Get a specific workout
export async function getWorkout(req, res) {
  try {
    const { workoutId } = req.params;
    const userId = req.user.id;

    const workout = await Workout.findOne({ _id: workoutId, userId }).populate(
      "userId",
      "name email"
    );

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Workout retrieved successfully",
      data: workout,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

// Update a workout
export async function updateWorkout(req, res) {
  try {
    const { workoutId } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    const workout = await Workout.findOneAndUpdate(
      { _id: workoutId, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Workout updated successfully",
      data: workout,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

// Delete a workout
export async function deleteWorkout(req, res) {
  try {
    const { workoutId } = req.params;
    const userId = req.user.id;

    const workout = await Workout.findOneAndDelete({ _id: workoutId, userId });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Workout deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

// Complete a workout
export async function completeWorkout(req, res) {
  try {
    const { workoutId } = req.params;
    const { performanceScore, caloriesBurned } = req.body;
    const userId = req.user.id;

    const workout = await Workout.findOne({ _id: workoutId, userId });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found",
        data: null,
      });
    }

    workout.isCompleted = true;
    if (performanceScore !== undefined)
      workout.performanceScore = performanceScore;
    if (caloriesBurned !== undefined) workout.caloriesBurned = caloriesBurned;

    await workout.save();

    res.status(200).json({
      success: true,
      message: "Workout completed successfully",
      data: workout,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

// ========== EXERCISE OPERATIONS ==========

// Add exercise to workout
export async function addExerciseToWorkout(req, res) {
  try {
    const { workoutId } = req.params;
    const exerciseData = req.body;
    const userId = req.user.id;

    const workout = await Workout.findOne({ _id: workoutId, userId });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found",
        data: null,
      });
    }

    workout.exercises.push(exerciseData);
    await workout.save();

    res.status(200).json({
      success: true,
      message: "Exercise added successfully",
      data: workout,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

// Update exercise in workout
export async function updateExerciseInWorkout(req, res) {
  try {
    const { workoutId, exerciseIndex } = req.params;
    const exerciseData = req.body;
    const userId = req.user.id;

    const workout = await Workout.findOne({ _id: workoutId, userId });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found",
        data: null,
      });
    }

    if (!workout.exercises[exerciseIndex]) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found",
        data: null,
      });
    }

    workout.exercises[exerciseIndex] = {
      ...workout.exercises[exerciseIndex],
      ...exerciseData,
    };
    await workout.save();

    res.status(200).json({
      success: true,
      message: "Exercise updated successfully",
      data: workout,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

// Remove exercise from workout
export async function removeExerciseFromWorkout(req, res) {
  try {
    const { workoutId, exerciseIndex } = req.params;
    const userId = req.user.id;

    const workout = await Workout.findOne({ _id: workoutId, userId });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found",
        data: null,
      });
    }

    if (!workout.exercises[exerciseIndex]) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found",
        data: null,
      });
    }

    workout.exercises.splice(exerciseIndex, 1);
    await workout.save();

    res.status(200).json({
      success: true,
      message: "Exercise removed successfully",
      data: workout,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

// Get workout statistics
export async function getWorkoutStats(req, res) {
  try {
    const userId = req.user.id;
    const { period = "30" } = req.query; // days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const stats = await Workout.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: 1 },
          completedWorkouts: { $sum: { $cond: ["$isCompleted", 1, 0] } },
          totalDuration: { $sum: "$totalDuration" },
          totalCalories: { $sum: "$caloriesBurned" },
          avgPerformance: { $avg: "$performanceScore" },
        },
      },
    ]);

    const result = stats[0] || {
      totalWorkouts: 0,
      completedWorkouts: 0,
      totalDuration: 0,
      totalCalories: 0,
      avgPerformance: 0,
    };

    res.status(200).json({
      success: true,
      message: "Workout statistics retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}
