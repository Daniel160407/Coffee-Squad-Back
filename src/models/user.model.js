import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false, // Exclude password from query results by default
  },
  age: {
    type: Number,
    min: [0, "Age cannot be negative"],
    max: [120, "Age seems unrealistic"],
  },
  gender: {
    type: String,
    enum: ["male", "female", "other", "prefer-not-to-say"],
  },
  heigth: {
    value: Number,
    unit: {
      type: String,
      enum: ["cm", "inches"],
      default: "cm",
    },
  },
  currentWeight: {
    value: Number,
    unit: {
      type: String,
      enum: ["kg", "lbs"],
      default: "kg",
    },
  },
  targetWeight: {
    value: Number,
    unit: {
      type: String,
      enum: ["kg", "lbs"],
      default: "kg",
    },
  },
  fitnessGoal: {
    type: String,
    enum: [
      "fat-loss",
      "muscle-gain",
      "endurance",
      "general-fitness",
      "athletic-performance",
    ],
    required: true,
  },
  activityLevel: {
    type: String,
    enum: [
      "sedentary",
      "lightly-active",
      "moderately-active",
      "very-active",
      "extremely-active",
    ],
    default: "moderately-active",
  },
  availableEquipment: [
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
      ],
    },
  ],
  dietaryPreference: {
    type: String,
    enum: [
      "balanced",
      "vegan",
      "vegetarian",
      "keto",
      "paleo",
      "low-carb",
      "high-protein",
    ],
    default: "balanced",
  },
  profilePicture: {
    type: String, // Cloudinary URL
    default: null,
  },
  currentStreak: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  badges: [
    {
      name: String,
      earnedAt: Date,
      icon: String,
    },
  ],
  lastActive: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
}

const User = mongoose.model("User", userSchema);
export default User;