import geminiService from "../services/gemini.service.js";
import AIInsight from "../models/ai_insight.model.js";
import mongoose from "mongoose";
import {
  getAllQuickReplies,
  getQuickRepliesByCategory,
} from "../config/quickReplies.config.js";

export const generateInsight = async (req, res) => {
  try {
    const {
      prompt,
      userId,
      insightType = "custom-query",
      quickReplyPayload,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required",
      });
    }

    // Validate userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId format",
      });
    }

    let insightData;

    // Check if this is a quick reply selection
    if (quickReplyPayload) {
      // Handle quick reply selection
      insightData = await geminiService.handleQuickReplySelection(
        quickReplyPayload,
        userId
      );
    } else {
      // Handle regular prompt
      if (!prompt) {
        return res.status(400).json({
          success: false,
          message: "Either prompt or quickReplyPayload is required",
        });
      }

      // Validate prompt length
      if (prompt.length > 1000) {
        return res.status(400).json({
          success: false,
          message: "Prompt is too long. Maximum 1000 characters allowed.",
        });
      }

      // You can build a prompt here, or just pass the user's prompt directly
      const userPrompt = `
        **USER REQUEST:**
        "${prompt}"
      `;

      // Call the service with BOTH arguments
      insightData = await geminiService.generateStructuredInsight(
        userPrompt, // The user's request
        userId // The user's ID
      );
    }

    // Save insight to DB and send response
    const newInsight = new AIInsight({
      ...insightData,
      userId: userId,
      insightType: insightType,
    });

    await newInsight.save();

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

/**
 * Get quick replies configuration for frontend
 * This endpoint provides all available quick reply options with their display text
 */
export const getQuickReplies = async (req, res) => {
  try {
    const { category } = req.query;

    let quickReplies;

    if (category) {
      // Get quick replies filtered by category
      quickReplies = getQuickRepliesByCategory(category);
    } else {
      // Get all quick replies
      quickReplies = getAllQuickReplies();
    }

    res.status(200).json({
      success: true,
      data: {
        quickReplies,
        total: quickReplies.length,
        categories: [...new Set(quickReplies.map((reply) => reply.category))],
      },
    });
  } catch (error) {
    console.error("Get Quick Replies Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get quick replies configuration",
    });
  }
};
