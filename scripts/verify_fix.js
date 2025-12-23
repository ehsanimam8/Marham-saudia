const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function checkModel() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelName = "gemini-2.0-flash";

    console.log(`Testing ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, are you working?");
        console.log(`✅ SUCCESS: ${modelName} responded!`);
        console.log(`Response: ${result.response.text()}`);
    } catch (e) {
        console.log(`❌ FAILED: ${modelName}`);
        console.log(e.message);
    }
}

checkModel();
