// Load environment variables from .env.local
require('dotenv').config({ path: './.env.local' });

const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function listModels() {
  try {
    const models = await ai.models.list();
    console.log("Available models:", models);
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

listModels();



