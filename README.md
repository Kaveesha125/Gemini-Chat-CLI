# Gemini Command-Line Chat

A simple and colorful command-line chat application using Google's Gemini API, featuring customizable themes.

<!--
  TODO: Add a demo of the chat in action here.
  You can record a short session and save it as a .webp or .gif file.

  Example:
  <p align="center">
    <img src="https://path/to/your/demo.webp" alt="Gemini Chat Demo" width="80%">
  </p>
-->

## ✨ Features

- **Interactive Chat**: Engage in real-time conversation with the Gemini model directly from your terminal.
- **Streaming Responses**: Responses are streamed token-by-token for a dynamic, real-time experience.
- **Customizable Themes**: Personalize your chat interface by changing the AI's response color.
- **Session Context**: The chat remembers the conversation history during a session to provide better context.
- **Thinking Indicator**: A subtle loader indicates when the AI is processing your request.

<!--
  TODO: Add a demo of the theme customization feature.
  This is a great place to show off the color options!

  Example:
  <p align="center">
    <img src="https://path/to/your/theme-demo.webp" alt="Theme Customization Demo" width="80%">
  </p>
-->

## 🚀 Setup and Installation

Follow these steps to get the chat client up and running.

> [!NOTE] > **Prerequisites**
>
> - You must have [Node.js](https://nodejs.org/) installed.
> - You need a Google AI Studio API key. You can get one from [makersuite.google.com](https://makersuite.google.com/).

### 1. Install Dependencies

First, clone the repository and navigate into the directory. Then, run the following command to install the necessary packages:

```bash
npm install @google/genai dotenv
```

### 2. Configure API Key

> [!IMPORTANT]
> Create a file named `.env` in the project's root directory. This file is essential for storing your API key securely. Add your key to this file as shown below, replacing `"YOUR_API_KEY_HERE"` with your actual key.
>
> ```
> GEMINI_API_KEY="YOUR_API_KEY_HERE"
> ```

The application is now configured and ready to use!

## 💻 Usage

To start the chat client, run the following command in your terminal:

```bash
npm run ai
```

You can now start chatting with the AI.

> [!TIP] > **Special Commands**
>
> You can use these commands inside the chat for more functionality:
>
> - **`theme`**: Opens the theme selection menu. Pick a specific color for the AI's responses or choose a random one. Your selection is saved for future sessions!
> - **`exit`** or **`quit`**: Ends the chat session and clears the session history.

## 🤝 Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please feel free to open an issue or submit a pull request.
