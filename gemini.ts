// Import the Gemini SDK from Google
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load the API key from your .env file
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

// Create the Gemini AI client
const genAI = new GoogleGenerativeAI(apiKey);

// Load the Gemini model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Exported function to generate response
export async function askGemini(userQuestion: string): Promise<string> {
  const result = await model.generateContent(userQuestion);
  const response = await result.response;
  const text = response.text();
  return text;
}
