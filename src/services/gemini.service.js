import model from "../config/gemini.js";
import User from "../models/user.model.js";

/**
 * This is your "master list" of fixed payloads (your "enums").
 * The AI will be instructed to ONLY use strings from this list.
 * Your frontend will map these payloads to user-friendly text.
 */
const ALLOWED_QUICK_REPLIES = [
  "VIEW_PERFORMANCE_DETAILS",
  "VIEW_NUTRITION_LOG",
  "VIEW_RECOVERY_TIPS",
  "GET_WORKOUT_SUGGESTION",
  "COMPARE_WEEKLY_STATS",
];

/**
 * This is the JSON schema definition that we will force Gemini to follow.
 * It matches the key fields in your Mongoose 'AIInsight' model.
 */
const insightSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string" },
          text: { type: "string" },
          priority: {
            type: "string",
            enum: ["low", "medium", "high"], // Solves the "High" vs "high" bug
          },
        },
      },
    },
    /**
     * This tells the AI that 'quickReplies' must be an array of strings,
     * and each string MUST be one of the items from your master list.
     */
    quickReplies: {
      type: "array",
      items: {
        type: "string",
        enum: ALLOWED_QUICK_REPLIES,
      },
    },
  },
  required: ["title", "summary"], // AI must at least provide these
};

/**
 * This function tells Gemini to generate a response that
 * perfectly fits our JSON schema.
 *
 * The 'prompt' argument it receives is the full, context-aware prompt
 * built by the controller (which includes user data, history, etc.).
 */
const generateStructuredInsight = async (prompt) => {
  // 1. Configure the model to use JSON mode and follow our schema
  const generationConfig = {
    response_mime_type: "application/json",
    response_schema: insightSchema,
  };

  const userInfo = await User.findOne({ _id: id });

  try {
    /**
     * 2. This is the final prompt sent to the AI.
     * It combines the user's request (from the controller)
     * with your non-negotiable system rules.
     */
    // This part is STATIC
    const serviceLevelPrompt = `
      **AI SYSTEM RULES (MUST FOLLOW):**
      1.  You MUST follow the provided JSON schema...
      2.  The "priority" field... MUST be "low", "medium", or "high".
      3.  For the "quickReplies" array, you MUST choose ${ALLOWED_QUICK_REPLIES[0]}
      4.  you MUST always check for userinfo: ${userInfo} 
      and take it to consideration`;

    // 3. Call the Gemini API
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: serviceLevelPrompt }] }],
      generationConfig,
    });

    // 4. Get the raw text (which is a JSON string) from the response
    const response = result.response;
    const responseText = response.candidates[0].content.parts[0].text;

    // 5. Parse the JSON string into a clean JavaScript object
    const structuredData = JSON.parse(responseText);

    // 6. Return the object to the controller
    return structuredData;
  } catch (error) {
    console.error("Gemini Service Error:", error);
    if (error.message.includes("JSON.parse")) {
      console.error("AI did not return valid JSON.");
    }
    throw new Error("Failed to generate structured AI insight.");
  }
};

export default {
  generateStructuredInsight,
};
