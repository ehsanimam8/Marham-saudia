const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Specific variants to try
    const modelsToTry = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-001",
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro",
        "gemini-1.5-pro-001"
    ];

    for (const modelName of modelsToTry) {
        console.log(`--- Testing ${modelName} ---`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            console.log(`✅ ${modelName} IS WORKING!`);
            console.log(result.response.text());
            return;
        } catch (e) {
            console.log(`❌ ${modelName} failed:`);
            console.log(e.message.split('\n')[0]); // First line of error
        }
    }
}

listModels();
