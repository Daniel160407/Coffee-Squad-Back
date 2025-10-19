import mongoose from "mongoose";

/**
 * ## QuickReplySchema
 * Defines the structure for a single quick reply button (recommended message).
 * This will be used as a sub-document.
 */
const QuickReplySchema = new mongoose.Schema(
  {
    /**
     * The text displayed on the button.
     * e.g., "Tell me more"
     */
    text: {
      type: String,
      required: true,
      trim: true,
    },
    /**
     * The payload (the request) sent back when clicked.
     * e.g., "GET_MORE_DETAILS_NUTRITION"
     */
    payload: {
      type: String,
      required: true,
    },
  },
  { _id: false } // No need for separate _ids on sub-documents
);

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
        "custom-query", // Added for more flexibility
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    /**
     * This is your "freestyle" message content.
     */
    summary: {
      type: String,
      required: true,
    },
    /**
     * NEW: This array will hold the "quick messages" (buttons).
     * It will be empty for freestyle-only messages.
     */
    quickReplies: [QuickReplySchema],
    details: {
      type: mongoose.Schema.Types.Mixed, // Flexible structure
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
      default: "gemini-2.5-flash", // Updated to match your config
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
