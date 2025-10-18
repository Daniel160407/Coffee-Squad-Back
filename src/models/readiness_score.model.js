import mongoose from "mongoose";

const readinessScoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      unique: true, // One score per day per user
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    factors: {
      sleepQuality: {
        score: {
          type: Number,
          min: 0,
          max: 100,
        },
        hoursSlept: Number,
        notes: String,
      },
      muscleRecovery: {
        score: {
          type: Number,
          min: 0,
          max: 100,
        },
        soreness: {
          type: String,
          enum: ["none", "mild", "moderate", "severe"],
        },
      },
      nutritionBalance: {
        score: {
          type: Number,
          min: 0,
          max: 100,
        },
        calorieDeficitSurplus: Number,
        hydrationLevel: {
          type: String,
          enum: ["poor", "fair", "good", "excellent"],
        },
      },
      stressLevel: {
        score: {
          type: Number,
          min: 0,
          max: 100,
        },
        rating: {
          type: String,
          enum: ["low", "moderate", "high", "very-high"],
        },
      },
      recentWorkloadIntensity: {
        score: {
          type: Number,
          min: 0,
          max: 100,
        },
        lastSevenDaysVolume: Number,
      },
    },
    recommendation: {
      type: String,
      enum: [
        "full-intensity",
        "moderate-intensity",
        "light-activity",
        "rest-day",
      ],
      required: true,
    },
    injuryRiskLevel: {
      type: String,
      enum: ["low", "moderate", "high"],
      default: "low",
    },
    mlPrediction: {
      fatigueLevel: Number, // 0-100
      performancePotential: Number, // 0-100
      modelVersion: String,
    },
    userFeedback: {
      feltAccurate: Boolean,
      actualPerformance: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user + date uniqueness
readinessScoreSchema.index({ userId: 1, date: 1 }, { unique: true });

const ReadinessScore = mongoose.model("ReadinessScore", readinessScoreSchema);
export default ReadinessScore;