import geminiService from "../services/gemini.service.js";
import AIInsight from "../models/ai_insight.model.js"; // Import your Mongoose model

/**
 * Renamed to 'generateInsight' as it's more descriptive.
 * This controller now generates the insight AND saves it to the DB.
 */
export const generateInsight = async (req, res) => {
  try {
    const { prompt, userId, insightType = "custom-query" } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    // 1. Call the service to get the structured JSON data from Gemini
    // We can enhance the prompt to be more specific.
    const fullPrompt = `
      Based on the following request, generate an insight. 
      Follow the provided JSON schema exactly.
      If no quick replies are logical, return an empty "quickReplies" array.
      
      User Request: "${prompt}"
    `;

    const insightData = await geminiService.generateStructuredInsight(
      fullPrompt
    );

    // 2. Create and save the new insight to the database
    const newInsight = new AIInsight({
      ...insightData, // This includes title, summary, recommendations, quickReplies
      userId: userId,
      insightType: insightType,
      aiModel: "gemini-2.5-flash",
    });

    await newInsight.save();

    // 3. Return the full, saved document to the client
    res.status(200).json({
      success: true,
      data: newInsight,
    });
  } catch (error) {
    console.error("Gemini Controller Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
