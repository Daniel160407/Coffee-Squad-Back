import model from "../config/gemini.js";
import User from "../models/user.model.js";
import {
  getAllowedPayloads,
  QUICK_REPLIES_CONFIG,
} from "../config/quickReplies.config.js";

/**
 * Get allowed payloads for backend validation
 */
const ALLOWED_QUICK_REPLIES = getAllowedPayloads();

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
            enum: ["low", "medium", "high"],
          },
        },
      },
    },
    quickReplies: {
      type: "array",
      items: {
        type: "object",
        properties: {
          text: { type: "string" },
          payload: { type: "string" },
          category: { type: "string" },
          description: { type: "string" },
        },
        required: ["text", "payload"],
      },
    },
  },
  required: ["title", "summary"],
};

/**
 * BUG FIX 1: The function must accept 'userId' as an argument.
 */
const generateStructuredInsight = async (prompt, userId) => {
  // 1. Configure the model
  const generationConfig = {
    response_mime_type: "application/json",
    response_schema: insightSchema,
  };

  try {
    // 2. Find the user using the 'userId' from the arguments
    const userInfo = await User.findById(userId).select("name email -_id"); // .select() keeps the prompt clean

    /**
     * 3. This is the final prompt sent to the AI.
     */
    const serviceLevelPrompt = `
      ${prompt} // <-- BUG FIX 3: You MUST include the user's prompt

      ---
      **AI SYSTEM RULES (MUST FOLLOW):**
      1.  You MUST follow the provided JSON schema.
      2.  The "priority" field MUST be "low", "medium", or "high".
      3.  For the "quickReplies" array, you MUST generate 2-4 contextual quick replies that are MOST RELEVANT to the current conversation and user's needs.
      
      IMPORTANT RULES FOR DYNAMIC QUICK REPLIES:
      - Generate NEW, contextual quick replies based on the user's request and your response
      - Each quick reply should have: "text" (user-friendly button text), "payload" (unique identifier), "category" (workout/nutrition/recovery/tips/analytics), and "description" (what this reply does)
      - Make the quick replies SPECIFIC to the current context - don't use generic options
      - Examples of good dynamic replies:
        * If user asks about workout plans: "Create Upper Body Focus Plan", "Generate Cardio Routine", "Build Strength Program"
        * If user asks about nutrition: "Plan My Weekly Meals", "Calculate My Macros", "Find Healthy Snacks"
        * If user asks about recovery: "Sleep Optimization Tips", "Stress Management Plan", "Injury Prevention Guide"
      - The "payload" should be descriptive and unique (e.g., "CREATE_UPPER_BODY_PLAN", "CALCULATE_MACROS", "SLEEP_OPTIMIZATION")
      - Make replies actionable and specific to what the user might want to do next
      4.  You MUST always check this user's info and take it into consideration: ${JSON.stringify(
        userInfo
      )}
    `;

    // 4. Call the Gemini API
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: serviceLevelPrompt }] }],
      generationConfig,
    });

    // 5. Get and parse the response
    const response = result.response;
    const responseText = response.candidates[0].content.parts[0].text;
    const structuredData = JSON.parse(responseText);

    // 6. Return the object to the controller
    return structuredData;
  } catch (error) {
    console.error("Gemini Service Error:", error);

    // Handle specific error types
    if (error.message.includes("JSON.parse")) {
      console.error("AI did not return valid JSON.");
      throw new Error("AI response was not in valid JSON format.");
    }

    if (error.message.includes("API_KEY")) {
      console.error("Gemini API key is missing or invalid.");
      throw new Error("Gemini API configuration error.");
    }

    if (error.message.includes("quota")) {
      console.error("Gemini API quota exceeded.");
      throw new Error("API quota exceeded. Please try again later.");
    }

    if (error.message.includes("safety")) {
      console.error("Content was blocked by safety filters.");
      throw new Error(
        "Content was blocked by safety filters. Please try a different prompt."
      );
    }

    // Generic error fallback
    throw new Error(
      "Failed to generate structured AI insight. Please try again."
    );
  }
};

/**
 * Handle initial quick reply selection and generate contextual response
 */
const handleQuickReplySelection = async (payload, userId) => {
  try {
    // Find the selected quick reply
    const selectedReply = QUICK_REPLIES_CONFIG.find(
      (reply) => reply.payload === payload
    );

    if (!selectedReply) {
      throw new Error("Invalid quick reply payload");
    }

    // Create a contextual prompt based on the selected quick reply
    const contextualPrompt = `
      **USER REQUESTED:** ${selectedReply.text}
      **DESCRIPTION:** ${selectedReply.description}
      
      Please provide a comprehensive response for this request. After your main response, generate 2-4 NEW contextual quick replies that would be most relevant for the user to explore next.
    `;

    // Generate the structured insight with dynamic quick replies
    const insightData = await generateStructuredInsight(
      contextualPrompt,
      userId
    );

    return insightData;
  } catch (error) {
    console.error("Quick Reply Selection Error:", error);
    throw new Error("Failed to process quick reply selection");
  }
};

export default {
  generateStructuredInsight,
  handleQuickReplySelection,
};
