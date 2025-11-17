# Gemini Command-Line Chat

A simple and colorful command-line chat application using Google's Gemini API, featuring customizable themes.

- [Features](#-features)
- [Setup and Installation](#-setup-and-installation)
- [Usage](#-usage)
- [Demo](#-demo)

## ✨ Features

- **Interactive Chat**: Engage in real-time conversation with the Gemini model directly from your terminal.
- **Streaming Responses**: Responses are streamed token-by-token for a dynamic, real-time experience.
- **Customizable Themes**: Personalize your chat interface by changing the AI's response color.
- **Session Context**: The chat remembers the conversation history during a session to provide better context.
- **Thinking Indicator**: A subtle loader indicates when the AI is processing your request.

## 🚀 Setup and Installation

Follow these steps to get the chat client up and running.

> [!NOTE]
>
> > **Prerequisites**
>
> - You must have [Node.js](https://nodejs.org/) installed.
> - You need a Google AI Studio API key. You can get one from [Google Ai Studio](https://makersuite.google.com/).

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/Kaveesha125/Gemini-Chat-CLI.git
```

### 2. Navigate to the Directory

Change into the newly created directory:

```bash
cd Gemini-Chat-CLI
```

### 3. Install Dependencies

Install the necessary packages using npm:

```bash
npm install
```

### 4. Configure API Key

The application requires a Google AI API Key to function. The repository includes an example file to help you set it up.

First, create a `.env` file by copying the example:

```bash
cp .env.example .env
```

Next, open the newly created `.env` file with a text editor and replace `YOUR_API_KEY_GOES_HERE` with your actual key.

```
# Your Google API Key for Gemini
GEMINI_API_KEY="Your_Google_AI_API_Key_Here"
```

The application is now configured and ready to use!

## 💻 Usage

To start the chat client, run the following command in your terminal:

```bash
npm run ai
```

You can now start chatting with the AI.

> [!TIP]
>
> > **Special Commands**
>
> You can use these commands inside the chat for more functionality:
>
> - **`theme`**: Opens the theme selection menu. Pick a specific color for the AI's responses or choose a random one. Your selection is saved for future sessions!
> - **`exit`** or **`quit`**: Ends the chat session and clears the session history.
> - **`Ctrl + C`**: Exit the application without clearing session history.

## 📺 Demo

<img src="" width="650">

<table>
  <tr>
    <th align="center">Tutorial</th>
    <th align="center">Themes</th>
  </tr>
  <tr>
    <td align="center">
      <img src="" />
    </td>
    <td align="center">
      <img src=""/>
    </td>
  </tr>
</table>

## 🤝 Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please feel free to open an issue or submit a pull request.
