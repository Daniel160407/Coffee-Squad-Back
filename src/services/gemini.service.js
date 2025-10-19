import model from "../config/gemini.js";

/**
 * This is the JSON schema definition that we will force Gemini to follow.
 * It matches the key fields in our Mongoose AIInsight model.
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
          priority: { type: "string" },
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
        },
      },
    },
  },
  required: ["title", "summary"],
};

/**
 * This function tells Gemini to generate a response that
 * perfectly fits our JSON schema.
 */
const generateStructuredInsight = async (prompt) => {
  const generationConfig = {
    // Tell Gemini to respond in JSON format
    response_mime_type: "application/json",
    // Provide the exact schema it must follow
    response_schema: insightSchema,
  };

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = result.response;
    const responseText = response.candidates[0].content.parts[0].text;

    // The responseText is a JSON string, so we parse it
    const structuredData = JSON.parse(responseText);

    return structuredData;
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw new Error("Failed to generate structured AI insight.");
  }
};

export default {
  generateStructuredInsight,
};
