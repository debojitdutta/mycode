/*
    This script handles the Chatbot AI model response generation
 */

import { HfInference } from "https://cdn.jsdelivr.net/npm/@huggingface/inference@2.6.4/+esm";

/**
 * Generates an AI response using Hugging Face's inference API.
 * @param {string} message - User input
 * @returns {string} AI response
 */
export async function generateResponse(message) {

    const API_TOKEN = "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"; // API token
    const AI_MODEL = "tiiuae/falcon-7b-instruct"; // Chat model
    const inference = new HfInference(API_TOKEN);

    let response = ""; // To accumulate tokens

    try {
        for await (const chunk of inference.textGenerationStream({
            model: AI_MODEL,
            inputs: message,
            parameters: {
                max_new_tokens: 500,
                temperature: 0.7,
                top_p: 0.9,
            },
        })) {
            // console.log("Chunk received:", JSON.stringify(chunk, null, 2));

            const token = chunk?.token?.text; // Extract token text
            // console.log("token", token);
            if (token && token !== "<|endoftext|>") {
                response += token; // Accumulate the response
            }
        }

        // console.log("\n\nComplete Response:", response.trim());
        return response.trim();
    } catch (error) {
        console.log("Error generating response:", error.message || error);
        return "Something went wrong! error!";
    }

}