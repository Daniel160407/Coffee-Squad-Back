import mongoose from 'mongoose';

const aiInsightSchema = new mongoose.Schema(
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
    insightType: {
      type: String,
      enum: [
        "daily-summary",
        "weekly-summary",
        "monthly-summary",
        "performance-analysis",
        "nutrition-feedback",
        "recommendation",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed, // Flexible structure for various insights
    },
    recommendations: [
      {
        category: String, // workout, nutrition, recovery
        text: String,
        priority: {
          type: String,
          enum: ["low", "medium", "high"],
        },
      },
    ],
    dataSnapshot: {
      totalWorkouts: Number,
      totalCaloriesBurned: Number,
      totalCaloriesConsumed: Number,
      averageReadinessScore: Number,
      performanceChange: Number, // percentage
    },
    aiModel: {
      type: String,
      default: "gemini-2.0-flash",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
aiInsightSchema.index({ userId: 1, date: -1 });

const AIInsight = mongoose.model("AIInsight", aiInsightSchema);
export default AIInsight;