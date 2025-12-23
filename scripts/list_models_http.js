const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

async function checkModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.log("No API Key found");
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        console.log("Fetching models from API...");
        const response = await axios.get(url);
        if (response.data && response.data.models) {
            console.log("--- AVAILABLE MODELS ---");
            response.data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name.replace('models/', '')}`);
                }
            });
        }
    } catch (e) {
        console.log("Error listing models:");
        if (e.response) {
            console.log(`Status: ${e.response.status}`);
            console.log(JSON.stringify(e.response.data, null, 2));
        } else {
            console.log(e.message);
        }
    }
}

checkModels();
