import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
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
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    foods: [
      {
        name: String,
        quantity: Number,
        unit: String, // grams, oz, cups, etc.
      },
    ],
    calories: {
      type: Number,
      required: true,
    },
    macros: {
      protein: {
        type: Number,
        default: 0,
      },
      carbs: {
        type: Number,
        default: 0,
      },
      fats: {
        type: Number,
        default: 0,
      },
    },
    micronutrients: {
      fiber: Number,
      sugar: Number,
      sodium: Number,
      cholesterol: Number,
    },
    imageUrl: String, // Cloudinary URL for meal photo
    recipeUrl: String, // Link to recipe if AI-suggested
    aiGenerated: {
      type: Boolean,
      default: false,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
mealSchema.index({ userId: 1, date: -1 });

const Meal = mongoose.model("Meal", mealSchema);
export default Meal;