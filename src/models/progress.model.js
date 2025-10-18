import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
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
    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ["kg", "lbs"],
        default: "kg",
      },
    },
    bodyFatPercentage: Number,
    measurements: {
      chest: Number,
      waist: Number,
      hips: Number,
      thighs: Number,
      arms: Number,
      unit: {
        type: String,
        enum: ["cm", "inches"],
        default: "cm",
      },
    },
    photos: [
      {
        url: String, // Cloudinary URL
        type: {
          type: String,
          enum: ["front", "side", "back"],
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    strengthBenchmarks: {
      benchPress: Number,
      squat: Number,
      deadlift: Number,
      pullUps: Number,
      pushUps: Number,
    },
    cardioMetrics: {
      restingHeartRate: Number,
      vo2Max: Number,
      runningPace: Number, // minutes per km or mile
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
progressSchema.index({ userId: 1, date: -1 });

const Progress = mongoose.model("Progress", progressSchema);
export default Progress;