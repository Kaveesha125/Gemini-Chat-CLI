import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import * as fs from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// --- Path helpers for settings.json ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SETTINGS_FILE = join(__dirname, "settings.json");

// --- Your full color list ---
const colorList = {
  lightPink: "\x1b[38;5;218m",
  pastelPink: "\x1b[38;5;217m",
  hotPinkSoft: "\x1b[38;5;212m",
  peach: "\x1b[38;5;216m",
  lightCoral: "\x1b[38;5;210m",
  lightOrange: "\x1b[38;5;223m",
  lightYellow: "\x1b[38;5;229m",
  paleYellow: "\x1b[38;5;230m",
  pastelYellow: "\x1b[38;5;228m",
  mint: "\x1b[38;5;157m",
  aquaPastel: "\x1b[38;5;159m",
  skyBlue: "\x1b[38;5;153m",
  powderBlue: "\x1b[38;5;152m",
  lavender: "\x1b[38;5;183m",
  softPurple: "\x1b[38;5;182m",
  neonYellow: "\x1b[38;5;226m",
  neonGreen: "\x1b[38;5;46m",
  neonCyan: "\x1b[38;5;51m",
  neonPink: "\x1b[38;5;199m",
  neonRed: "\x1b[38;5;196m",
  neonPurple: "\x1b[38;5;129m",
  electricBlue: "\x1b[38;5;45m",
  gold: "\x1b[38;5;220m",
  amber: "\x1b[38;5;214m",
  sunset: "\x1b[38;5;209m",
  deepOrange: "\x1b[38;5;208m",
  teal: "\x1b[38;5;37m",
  turquoise: "\x1b[38;5;44m",
  indigo: "\x1b[38;5;54m",
  violet: "\x1b[38;5;93m",
  darkGray: "\x1b[38;5;240m",
  carbon: "\x1b[38;5;238m",
  slate: "\x1b[38;5;244m",
  deepBlue: "\x1b[38;5;18m",
  darkViolet: "\x1b[38;5;90m",
  wine: "\x1b[38;5;88m",
  forest: "\x1b[38;5;22m",
  armyGreen: "\x1b[38;5;58m",
  earthBrown: "\x1b[38;5;130m",
  bubblegum: "\x1b[38;5;205m",
  raspberry: "\x1b[38;5;198m",
  lime: "\x1b[38;5;118m",
  aquaBright: "\x1b[38;5;50m",
  skyBright: "\x1b[38;5;117m",
  purpleBright: "\x1b[38;5;135m",
};
const colorNames = Object.keys(colorList);

// --- System Colors (for prompts, errors, etc.) ---
const systemColors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m", // User input prompt color
  aquaBright: "\x1b[38;5;50m", // Loader color
  red: "\x1b[31m", // Error color
  blue: "\x1b[34m", // For exit message
};

// --- Theme colors object (ONLY for AI response) ---
let themeColors = {
  aiResponse: systemColors.green, // Default to green
};

// --- Configuration ---
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error(
    `${systemColors.red}❌ ERROR: 'GEMINI_API_KEY' not found.${systemColors.reset}`
  );
  console.error(
    "Please check your .env file in this directory and make sure it contains:"
  );
  console.error('GEMINI_API_KEY="your_key_here"');
  process.exit(1);
}

const MODEL_NAME = "gemini-2.5-flash-lite";
const HISTORY_FILE = "chat_history.txt";

// --- Initialization ---
const ai = new GoogleGenAI({ apiKey: API_KEY });
const rl = readline.createInterface({ input, output });

// --- Loader Functionality (Unchanged) ---
let loaderInterval = null;
const loaderFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const loaderText = "AI is thinking";

function startLoader() {
  process.stdout.write("\x1b[?25l");
  let i = 0;
  loaderInterval = setInterval(() => {
    const frame = loaderFrames[(i = (i + 1) % loaderFrames.length)];
    process.stdout.write(
      `\r${systemColors.aquaBright}${loaderText} ${frame}${systemColors.reset}`
    );
  }, 80);
}

function stopLoader() {
  if (loaderInterval) {
    clearInterval(loaderInterval);
    loaderInterval = null;
    process.stdout.write("\r" + " ".repeat(loaderText.length + 5) + "\r");
    process.stdout.write("\x1b[?25h");
  }
}
// --- END Loader ---

// --- Theme Functions (Unchanged) ---
async function loadSettings() {
  try {
    const settingsText = await fs.readFile(SETTINGS_FILE, "utf-8");
    const settings = JSON.parse(settingsText);
    if (settings.aiResponse) themeColors.aiResponse = settings.aiResponse;
    console.log("(Loaded theme from settings.json)");
  } catch (error) {
    // No settings file found, just use defaults
  }
}

async function saveSettings() {
  try {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(themeColors, null, 2));
  } catch (error) {
    console.error(
      `${systemColors.red}Error saving settings: ${error.message}${systemColors.reset}`
    );
  }
}

function getRandomColor() {
  const randomName = colorNames[Math.floor(Math.random() * colorNames.length)];
  return colorList[randomName];
}

async function handleThemeCommand() {
  console.log(
    `\n--- ${systemColors.green}🎨 AI Response Color Setup${systemColors.reset} ---`
  );
  console.log("Select a color by number, or type 'r' for random.");

  colorNames.forEach((name, index) => {
    console.log(`${index + 1}. ${colorList[name]}${name}${systemColors.reset}`);
  });

  let aiColor;

  while (true) {
    const choice = await rl.question(
      `\n${systemColors.yellow}Enter number for AI Response color (current: ${themeColors.aiResponse}this${systemColors.reset}): ${systemColors.reset}`
    );
    if (choice.toLowerCase() === "r") {
      aiColor = getRandomColor();
      console.log(`AI color set to: ${aiColor}random${systemColors.reset}`);
      break;
    }
    const index = parseInt(choice) - 1;
    if (index >= 0 && index < colorNames.length) {
      aiColor = colorList[colorNames[index]];
      console.log(
        `AI color set to: ${aiColor}${colorNames[index]}${systemColors.reset}`
      );
      break;
    }
    console.log(
      `${systemColors.red}Invalid choice. Please try again.${systemColors.reset}`
    );
  }

  themeColors.aiResponse = aiColor;
  await saveSettings();
  console.log(`\n${systemColors.green}✅ Theme saved!${systemColors.reset}`);
}
// --- END Theme ---

// --- History Function (Unchanged) ---
async function loadHistory(chat) {
  try {
    const historyText = await fs.readFile(HISTORY_FILE, "utf-8");
    const history = historyText
      .split("\n")
      .filter((line) => line.trim() !== "");

    for (const message of history) {
      // We just send the messages; the AI will follow the rule we set
      await chat.sendMessage({ message, stream: false });
    }
    if (history.length > 0) {
      console.log(`(Loaded ${history.length} previous messages for context.)`);
    }
  } catch (error) {
    // File likely doesn't exist, which is fine
  }
}
// --- END History ---

// --- Main Function ---
async function main() {
  await loadSettings();

  console.log(
    `${systemColors.green}🤖 JS Gemini Chat | Connected to ${MODEL_NAME}${systemColors.reset}`
  );
  console.log("Type 'exit', 'quit', or 'theme' to change AI color.");

  try {
    // --- 💡 START OF FIX 💡 ---
    // 1. Add generationConfig here as a backup
    const chat = ai.chats.create({
      model: MODEL_NAME,
      generationConfig: {
        responseMimeType: "text/plain",
      },
    });

    // 2. Send the priming message *before* loading history
    await chat.sendMessage({
      stream: false, // We don't need to see the AI's "OK" response
      message:
        "You are a helpful assistant. From now on, all your responses MUST be in plain text. Do not use Markdown, bolding, code blocks, headers, lists, or any other formatting. Just send the raw, unformatted text.only use emojis if needed.",
    });
    // --- 💡 END OF FIX 💡 ---

    await loadHistory(chat); // Now load the history

    while (true) {
      const userInput = await rl.question(
        `\n${systemColors.yellow}👤 You: ${systemColors.reset}`
      );
      const cleanInput = userInput.trim();
      const cleanLower = cleanInput.toLowerCase();

      // --- START: MODIFIED EXIT BLOCK (Unchanged) ---
      if (cleanLower === "exit" || cleanLower === "quit") {
        try {
          await fs.unlink(HISTORY_FILE);
          console.log("(Chat history cleared.)");
        } catch (err) {
          // Ignore error if file doesn't exist
        }
        console.log(
          `${systemColors.blue}👋 Session ended. Goodbye!${systemColors.reset}`
        );
        break;
      }
      // --- END: MODIFIED EXIT BLOCK ---

      if (cleanLower === "theme") {
        await handleThemeCommand();
        continue;
      }

      if (!cleanInput) continue;

      startLoader();

      const responseStream = await chat.sendMessageStream({
        message: cleanInput,
      });

      stopLoader();

      process.stdout.write(
        `${themeColors.aiResponse}🤖 AI: ${systemColors.reset}`
      );

      // This part was already correct in your script (using chunk.text)
      for await (const chunk of responseStream) {
        const chunkText = chunk.text;
        process.stdout.write(
          `${themeColors.aiResponse}${chunkText}${systemColors.reset}`
        );
      }

      process.stdout.write("\n");

      // --- History logic (Unchanged) ---
      await fs.appendFile(HISTORY_FILE, cleanInput + "\n");
    }
  } catch (e) {
    stopLoader();
    console.error(
      `\n${systemColors.red}ERROR: An API or network error occurred.${systemColors.reset}`
    );
    console.error(e.message);
  } finally {
    stopLoader();
    rl.close();
  }
}

main();
