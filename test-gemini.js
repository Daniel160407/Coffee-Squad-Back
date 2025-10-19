/**
 * Test script for Gemini AI integration
 * Run this with: node test-gemini.js
 * Make sure to set your GEMINI_API_KEY in .env file first
 */

import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

async function testGeminiConnection() {
  try {
    console.log("Testing Gemini AI connection...");

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not found in environment variables");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      "Hello, can you respond with 'Gemini AI is working!'?"
    );
    const response = await result.response;
    const text = response.text();

    console.log("✅ Gemini AI Response:", text);
    console.log("✅ Gemini AI integration is working correctly!");
  } catch (error) {
    console.error("❌ Gemini AI Test Failed:", error.message);
    console.log("\nTroubleshooting steps:");
    console.log("1. Make sure you have a .env file with GEMINI_API_KEY");
    console.log("2. Get your API key from: https://aistudio.google.com/");
    console.log("3. Ensure your API key has proper permissions");
  }
}

// Run the test
testGeminiConnection();
