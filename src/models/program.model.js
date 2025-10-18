import mongoose from "mongoose";

const weekSchema = new mongoose.Schema({
  weekNumber: {
    type: Number,
    required: true,
  },
  focus: {
    type: String,
    example: "Strength Building",
  },
  workouts: [
    {
      day: {
        type: Number,
        min: 1,
        max: 7,
      },
      workoutId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workout",
      },
      title: String,
      type: {
        type: String,
        enum: [
          "strength",
          "cardio",
          "hiit",
          "flexibility",
          "sports",
          "mixed",
          "rest",
        ],
      },
      completed: {
        type: Boolean,
        default: false,
      },
      completedAt: Date,
    },
  ],
});

const programSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      example: "12-Week Muscle Building Program",
    },
    description: {
      type: String,
      required: true,
      example: "A comprehensive program designed to build lean muscle mass",
    },
    goal: {
      type: String,
      enum: [
        "fat-loss",
        "muscle-gain",
        "endurance",
        "general-fitness",
        "athletic-performance",
        "strength",
        "flexibility",
      ],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
      default: "beginner",
    },
    duration: {
      weeks: {
        type: Number,
        required: true,
        min: 1,
        max: 52,
      },
      daysPerWeek: {
        type: Number,
        required: true,
        min: 1,
        max: 7,
      },
    },
    weeks: [weekSchema],
    equipmentRequired: [
      {
        type: String,
        enum: [
          "dumbbells",
          "barbell",
          "kettlebell",
          "resistance-bands",
          "pull-up-bar",
          "bench",
          "cardio-machine",
          "bodyweight-only",
          "cable-machine",
          "other",
        ],
      },
    ],
    tags: [
      {
        type: String,
        example: "hypertrophy",
      },
    ],
    creator: {
      type: String,
      enum: ["ai-generated", "user-created", "coach", "template"],
      default: "user-created",
    },
    aiGenerationPrompt: {
      type: String,
      // Stores the original prompt if AI-generated
    },
    status: {
      type: String,
      enum: ["draft", "active", "completed", "paused", "abandoned"],
      default: "draft",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    currentWeek: {
      type: Number,
      default: 1,
    },
    progress: {
      completedWorkouts: {
        type: Number,
        default: 0,
      },
      totalWorkouts: {
        type: Number,
        default: 0,
      },
      completionPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },
    nutrition: {
      includeNutritionPlan: {
        type: Boolean,
        default: false,
      },
      dailyCalories: Number,
      macros: {
        protein: Number,
        carbs: Number,
        fats: Number,
      },
    },
    notes: {
      type: String,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Number,
      default: 0,
    },
    usedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
programSchema.index({ userId: 1, status: 1 });
programSchema.index({ goal: 1, difficulty: 1, isPublic: 1 });
programSchema.index({ averageRating: -1, likes: -1 });

// Virtual for calculating total weeks
programSchema.virtual("totalWeeks").get(function () {
  return this.duration.weeks;
});

// Method to calculate progress
programSchema.methods.calculateProgress = function () {
  let completed = 0;
  let total = 0;

  this.weeks.forEach((week) => {
    week.workouts.forEach((workout) => {
      total++;
      if (workout.completed) {
        completed++;
      }
    });
  });

  this.progress.completedWorkouts = completed;
  this.progress.totalWorkouts = total;
  this.progress.completionPercentage =
    total > 0 ? Math.round((completed / total) * 100) : 0;
};

// Method to mark workout as completed
programSchema.methods.completeWorkout = function (weekNumber, workoutIndex) {
  const week = this.weeks.find((w) => w.weekNumber === weekNumber);
  if (week && week.workouts[workoutIndex]) {
    week.workouts[workoutIndex].completed = true;
    week.workouts[workoutIndex].completedAt = new Date();
    this.calculateProgress();
  }
};

// Method to start the program
programSchema.methods.startProgram = function () {
  this.status = "active";
  this.startDate = new Date();
  this.endDate = new Date();
  this.endDate.setDate(this.endDate.getDate() + this.duration.weeks * 7);
};

// Method to calculate average rating
programSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    return;
  }

  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10;
};

// Pre-save hook to calculate total workouts
programSchema.pre("save", function (next) {
  if (this.isModified("weeks")) {
    this.calculateProgress();
  }
  next();
});

const Program = mongoose.model("Program", programSchema);
export default Program;