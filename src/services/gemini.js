import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "your_api_key";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateStudyNotes(topic) {
  try {
    const prompt = `Create structured study notes for the topic: "${topic}". 
    Format the response as a valid JSON object with the following structure:
    {
      "title": "A clear title",
      "summary": "A brief summary of the topic",
      "points": ["Key point 1", "Key point 2", "Key point 3", ...]
    }
    Do not include markdown code blocks, just the raw JSON.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Clean up potential markdown formatting if Gemini includes it
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Error generating notes:", error);
    throw error;
  }
}

export async function askAI(question) {
  try {
    const result = await model.generateContent(question);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error asking AI:", error);
    throw error;
  }
}
