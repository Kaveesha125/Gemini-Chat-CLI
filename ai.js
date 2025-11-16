import 'dotenv/config'; // <-- ADDED: Loads .env file immediately
import { GoogleGenAI } from '@google/genai';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import * as fs from 'node:fs/promises';

// --- Configuration ---
// The API key is now loaded from your .env file
const API_KEY = process.env.GEMINI_API_KEY;

// --- ADDED: Check if the key was actually loaded ---
if (!API_KEY) {
    console.error("❌ ERROR: 'GEMINI_API_KEY' not found.");
    console.error("Please check your .env file in this directory and make sure it contains:");
    console.error('GEMINI_API_KEY="your_key_here"');
    process.exit(1); // Stop the script
}
// --- END OF CHECK ---

const MODEL_NAME = 'gemini-2.5-flash';
const HISTORY_FILE = 'chat_history.txt'; // Saved in the project folder

// --- Initialization ---
const ai = new GoogleGenAI({ apiKey: API_KEY });
const rl = readline.createInterface({ input, output });

// Function to load and send history to the chat model
async function loadHistory(chat) {
    try {
        const historyText = await fs.readFile(HISTORY_FILE, 'utf-8');
        const history = historyText.split('\n').filter(line => line.trim() !== '');

        for (const message of history) {
            // Replay history messages to the model for context
            await chat.sendMessage({ message, stream: false });
        }
        console.log(`(Loaded ${history.length} previous messages for context.)`);
    } catch (error) {
        // File likely doesn't exist, which is fine
    }
}

// --- Main Function ---
async function main() {
    console.log(`🤖 JS Gemini Chat | Connected to ${MODEL_NAME}`);
    console.log("Type 'exit' or press Ctrl+C to quit.");

    try {
        const chat = ai.chats.create({ model: MODEL_NAME });
        await loadHistory(chat);

        while (true) {
            const userInput = await rl.question('\n👤 You: ');
            const cleanInput = userInput.trim();

            if (cleanInput.toLowerCase() === 'exit' || cleanInput.toLowerCase() === 'quit') {
                console.log("👋 Session ended. Goodbye!");
                break;
            }

            if (!cleanInput) continue;

            // Send message and get response
            const response = await chat.sendMessage({ message: cleanInput, stream: false });

            // Print AI response
            console.log(`🤖 AI: ${response.text}`);

            // Save the current user message to history
            await fs.appendFile(HISTORY_FILE, cleanInput + '\n');
        }

    } catch (e) {
        console.error("\nERROR: An API or network error occurred.");
        console.error(e.message);
    } finally {
        rl.close();
    }
}

main();

