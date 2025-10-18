import mongoose from "mongoose";
import Program from "../models/program.model.js";
import Workout from "../models/workout.model.js";
import Progress from "../models/progress.model.js";

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

// ========== PROGRESS TRACKING OPERATIONS ==========

// Create a new progress entry
export async function createProgress(req, res) {
  try {
    const {
      date,
      weight,
      bodyFatPercentage,
      measurements,
      photos,
      strengthBenchmarks,
      cardioMetrics,
      notes,
    } = req.body;
    const userId = req.user.id;

    const progress = new Progress({
      userId,
      date,
      weight,
      bodyFatPercentage,
      measurements,
      photos,
      strengthBenchmarks,
      cardioMetrics,
      notes,
    });

    await progress.save();

    res.status(201).json({
      success: true,
      message: "Progress entry created successfully",
      data: progress,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

// Get all progress entries for a user
export async function getProgressEntries(req, res) {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, startDate, endDate } = req.query;

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

    const progressEntries = await Progress.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Progress.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Progress entries retrieved successfully",
      data: {
        progressEntries,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

// Get a specific progress entry by ID
export async function getProgressEntry(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid progress entry ID",
        data: null,
      });
    }

    const progressEntry = await Progress.findOne({ _id: id, userId });

    if (!progressEntry) {
      return res.status(404).json({
        success: false,
        message: "Progress entry not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Progress entry retrieved successfully",
      data: progressEntry,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

// Update a progress entry
export async function updateProgressEntry(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid progress entry ID",
        data: null,
      });
    }

    const progressEntry = await Progress.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!progressEntry) {
      return res.status(404).json({
        success: false,
        message: "Progress entry not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Progress entry updated successfully",
      data: progressEntry,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

// Delete a progress entry
export async function deleteProgressEntry(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid progress entry ID",
        data: null,
      });
    }

    const progressEntry = await Progress.findOneAndDelete({ _id: id, userId });

    if (!progressEntry) {
      return res.status(404).json({
        success: false,
        message: "Progress entry not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Progress entry deleted successfully",
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

// Get progress statistics and analytics
export async function getProgressStats(req, res) {
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

    const stats = await Progress.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalEntries: { $sum: 1 },
          latestWeight: { $last: "$weight.value" },
          earliestWeight: { $first: "$weight.value" },
          avgBodyFat: { $avg: "$bodyFatPercentage" },
          latestBodyFat: { $last: "$bodyFatPercentage" },
          weightChange: {
            $subtract: [
              { $last: "$weight.value" },
              { $first: "$weight.value" },
            ],
          },
          avgBenchPress: { $avg: "$strengthBenchmarks.benchPress" },
          avgSquat: { $avg: "$strengthBenchmarks.squat" },
          avgDeadlift: { $avg: "$strengthBenchmarks.deadlift" },
          avgPullUps: { $avg: "$strengthBenchmarks.pullUps" },
          avgPushUps: { $avg: "$strengthBenchmarks.pushUps" },
          avgRestingHR: { $avg: "$cardioMetrics.restingHeartRate" },
          avgVO2Max: { $avg: "$cardioMetrics.vo2Max" },
        },
      },
      {
        $project: {
          _id: 0,
          totalEntries: 1,
          latestWeight: 1,
          earliestWeight: 1,
          avgBodyFat: { $round: ["$avgBodyFat", 2] },
          latestBodyFat: 1,
          weightChange: 1,
          avgBenchPress: { $round: ["$avgBenchPress", 2] },
          avgSquat: { $round: ["$avgSquat", 2] },
          avgDeadlift: { $round: ["$avgDeadlift", 2] },
          avgPullUps: { $round: ["$avgPullUps", 2] },
          avgPushUps: { $round: ["$avgPushUps", 2] },
          avgRestingHR: { $round: ["$avgRestingHR", 2] },
          avgVO2Max: { $round: ["$avgVO2Max", 2] },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Progress statistics retrieved successfully",
      data: stats[0] || {
        totalEntries: 0,
        latestWeight: null,
        earliestWeight: null,
        avgBodyFat: 0,
        latestBodyFat: null,
        weightChange: 0,
        avgBenchPress: 0,
        avgSquat: 0,
        avgDeadlift: 0,
        avgPullUps: 0,
        avgPushUps: 0,
        avgRestingHR: 0,
        avgVO2Max: 0,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

// Get progress trends over time
export async function getProgressTrends(req, res) {
  try {
    const userId = req.user.id;
    const { startDate, endDate, metric } = req.query;

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

    const trends = await Progress.find(query)
      .sort({ date: 1 })
      .select("date weight bodyFatPercentage strengthBenchmarks cardioMetrics")
      .exec();

    // Process trends data based on requested metric
    const processedTrends = trends.map((entry) => {
      const trendData = {
        date: entry.date,
      };

      switch (metric) {
        case "weight":
          trendData.value = entry.weight?.value;
          break;
        case "bodyFat":
          trendData.value = entry.bodyFatPercentage;
          break;
        case "benchPress":
          trendData.value = entry.strengthBenchmarks?.benchPress;
          break;
        case "squat":
          trendData.value = entry.strengthBenchmarks?.squat;
          break;
        case "deadlift":
          trendData.value = entry.strengthBenchmarks?.deadlift;
          break;
        case "pullUps":
          trendData.value = entry.strengthBenchmarks?.pullUps;
          break;
        case "pushUps":
          trendData.value = entry.strengthBenchmarks?.pushUps;
          break;
        case "restingHR":
          trendData.value = entry.cardioMetrics?.restingHeartRate;
          break;
        case "vo2Max":
          trendData.value = entry.cardioMetrics?.vo2Max;
          break;
        default:
          // Return all metrics if no specific metric requested
          trendData.weight = entry.weight?.value;
          trendData.bodyFat = entry.bodyFatPercentage;
          trendData.benchPress = entry.strengthBenchmarks?.benchPress;
          trendData.squat = entry.strengthBenchmarks?.squat;
          trendData.deadlift = entry.strengthBenchmarks?.deadlift;
          trendData.pullUps = entry.strengthBenchmarks?.pullUps;
          trendData.pushUps = entry.strengthBenchmarks?.pushUps;
          trendData.restingHR = entry.cardioMetrics?.restingHeartRate;
          trendData.vo2Max = entry.cardioMetrics?.vo2Max;
      }

      return trendData;
    });

    res.status(200).json({
      success: true,
      message: "Progress trends retrieved successfully",
      data: {
        trends: processedTrends,
        metric: metric || "all",
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}
