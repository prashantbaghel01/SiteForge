const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    // Note: getGenerativeModel doesn't list models, we might need a REST call or if the SDK supports it.
    // Wait, the new SDK doesn't have listModels directly on genAI, or maybe it does?
    // Let's do a direct fetch to the API.
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    console.log(data.models.map(m => m.name).join('\n'));
  } catch (err) {
    console.error(err);
  }
}

listModels();
