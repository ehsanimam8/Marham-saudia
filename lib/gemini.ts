import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
}

const MAX_RETRIES = 3;
const BASE_DELAY = 1000;

export async function generateContent(prompt: string) {
    if (!model) {
        if (!apiKey) {
            console.warn("GEMINI_API_KEY not found in environment variables.");
            return "AI service unavailable (missing key).";
        }
        // Re-init if for some reason it wasn't
        genAI = new GoogleGenerativeAI(apiKey);
        model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    }

    let lastError;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            lastError = error;
            const isRateLimit = error?.message?.includes('429');
            const isOverloaded = error?.message?.includes('503');

            if (isRateLimit || isOverloaded) {
                if (attempt < MAX_RETRIES) {
                    const delay = BASE_DELAY * Math.pow(2, attempt); // 1s, 2s, 4s
                    console.warn(`Gemini API Busy (429/503). Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
            }
            break;
        }
    }

    if (lastError?.message?.includes('429')) {
        console.warn("Gemini API Rate Limit (429) hit. Max retries exceeded.");
    } else {
        console.error("Error generating content with Gemini:", lastError);
    }
    throw lastError;
}
