import geminiService from "../services/gemini.service.js";

export const generateText = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const result = await geminiService.generateText(prompt);

    res.status(200).json({
      success: true,
      text: result.text,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Test Gemini Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};