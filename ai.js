import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import * as fs from "node:fs/promises";

// --- ADDED: Recommendation #4 (Colors) ---
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  teal: "\x1b[38;5;50m",
};
// --- END: Recommendation #4 ---

// --- Configuration ---
// The API key is now loaded from your .env file
const API_KEY = process.env.GEMINI_API_KEY;
// --- ADDED: Check if the key was actually loaded ---
if (!API_KEY) {
  // --- MODIFIED: Added color ---
  console.error(
    `${colors.red}❌ ERROR: 'GEMINI_API_KEY' not found.${colors.reset}`
  );
  console.error(
    "Please check your .env file in this directory and make sure it contains:"
  );
  console.error('GEMINI_API_KEY="your_key_here"');
  process.exit(1);
  // Stop the script
}
// --- END OF CHECK ---

const MODEL_NAME = "gemini-2.5-flash-lite";
const HISTORY_FILE = "chat_history.txt";
// Saved in the project folder

// --- Initialization ---
const ai = new GoogleGenAI({ apiKey: API_KEY });
const rl = readline.createInterface({ input, output });

// --- START: ADDED LOADER FUNCTIONALITY ---
let loaderInterval = null;
const loaderFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const loaderText = "AI is thinking";

function startLoader() {
  process.stdout.write("\x1b[?25l"); // Hide cursor
  let i = 0;
  loaderInterval = setInterval(() => {
    const frame = loaderFrames[(i = (i + 1) % loaderFrames.length)];
    // \r = Carriage Return (goes to start of line without a newline)
    process.stdout.write(
      `\r${colors.blue}${loaderText} ${frame}${colors.reset}`
    );
  }, 80); // Animation speed in ms
}

function stopLoader() {
  if (loaderInterval) {
    clearInterval(loaderInterval);
    loaderInterval = null;
    // Clear the loader line and show cursor
    process.stdout.write("\r" + " ".repeat(loaderText.length + 5) + "\r");
    process.stdout.write("\x1b[?25h"); // Show cursor
  }
}
// --- END: ADDED LOADER FUNCTIONALITY ---

// Function to load and send history to the chat model
async function loadHistory(chat) {
  try {
    const historyText = await fs.readFile(HISTORY_FILE, "utf-8");
    const history = historyText
      .split("\n")
      .filter((line) => line.trim() !== "");

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
  // --- MODIFIED: Added color ---
  console.log(
    `${colors.green}🤖 JS Gemini Chat | Connected to ${MODEL_NAME}${colors.reset}`
  );
  console.log("Type 'exit' or press Ctrl+C to quit.");

  try {
    const chat = ai.chats.create({ model: MODEL_NAME });
    await loadHistory(chat);

    while (true) {
      // --- MODIFIED: Added color ---
      const userInput = await rl.question(
        `\n${colors.yellow}👤 You: ${colors.reset}`
      );
      const cleanInput = userInput.trim();

      if (
        cleanInput.toLowerCase() === "exit" ||
        cleanInput.toLowerCase() === "quit"
      ) {
        // --- MODIFIED: Added color ---
        console.log(`${colors.blue}👋 Session ended. Goodbye!${colors.reset}`);
        break;
      }

      if (!cleanInput) continue;

      // --- MODIFIED: Added Loader ---
      startLoader(); // Start the "thinking" animation

      // --- START: Recommendation #1 (Streaming) ---
      const responseStream = await chat.sendMessageStream({
        message: cleanInput,
      });

      stopLoader(); // Stop the animation right after we get the first response
      // --- END: Modified Loader ---

      // --- MODIFIED: Added color ---
      process.stdout.write(`${colors.green}🤖 AI: ${colors.reset}`); // Print the prefix once

      for await (const chunk of responseStream) {
        const chunkText = chunk.text;
        process.stdout.write(`${colors.teal}${chunkText}${colors.reset}`);
      }

      process.stdout.write("\n"); // Add a final newline
      // --- END: Recommendation #1 ---

      // --- KEPT AS-IS (Per user request for NO OTHER CHANGE) ---
      // Save the current user message to history
      await fs.appendFile(HISTORY_FILE, cleanInput + "\n");
    }
  } catch (e) {
    stopLoader(); // --- ADDED: Ensure loader stops on error ---
    // --- MODIFIED: Added color ---
    console.error(
      `\n${colors.red}ERROR: An API or network error occurred.${colors.reset}`
    );
    console.error(e.message);
  } finally {
    stopLoader(); // --- ADDED: Ensure loader stops on exit ---
    rl.close();
  }
}

main();
