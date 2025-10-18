import model from "../config/gemini.js";

class GeminiService {
  async generateText(prompt) {
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      return {
        success: true,
        text,
      };
    } catch (error) {
      console.error("Gemini Error:", error);
      throw new Error(`Failed to generate text: ${error.message}`);
    }
  }
}

const geminiService = new GeminiService();
export default geminiService;