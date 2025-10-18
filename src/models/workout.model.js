import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sets: Number,
  reps: Number,
  duration: Number, // in seconds
  weight: {
    value: Number,
    unit: String, // kg, lbs
  },
  restTime: Number, // in seconds
  notes: String,
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
  },
});

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    type: {
      type: String,
      enum: ["strength", "cardio", "hiit", "flexibility", "sports", "mixed"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    exercises: [exerciseSchema],
    totalDuration: {
      type: Number,
      required: true,
    },
    caloriesBurned: {
      type: Number,
      default: 0,
    },
    performanceScore: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
workoutSchema.index({ userId: 1, date: -1 });

const Workout = mongoose.model("Workout", workoutSchema);
export default Workout;
