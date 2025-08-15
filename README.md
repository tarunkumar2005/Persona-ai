# 🤖 Persona AI Chat Application

*Experience intelligent conversations with AI personas of your favorite tech mentors*

[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![GitHub Models API](https://img.shields.io/badge/Powered_by-GitHub_Models-purple?style=flat-square&logo=github)](https://github.com/marketplace/models)
[![GPT-4o](https://img.shields.io/badge/AI-GPT--4o-green?style=flat-square&logo=openai)](https://openai.com/)

## 📖 Description

**Persona AI Chat** is a cutting-edge Next.js application that brings AI-powered conversations with distinct personalities of renowned tech educators **Hitesh Choudhary** and **Piyush Garg**. Built with modern web technologies and powered by GitHub's Models API using OpenAI's GPT-4o, this application offers an immersive chat experience with carefully crafted AI personas.

The application leverages extensive prompt engineering to accurately represent each mentor's teaching style, communication patterns, and expertise areas. Users can engage in meaningful technical discussions, seek coding advice, and learn from these AI-powered mentors in a natural, conversational manner.

**Key Technologies:**
- **Frontend**: Next.js 15.4.6 with TypeScript and Tailwind CSS
- **AI Integration**: GitHub Models API with OpenAI GPT-4o
- **Animations**: Framer Motion for smooth transitions and interactions
- **State Management**: Session-based conversation tracking
- **UI Components**: Radix UI with custom styling

## ⚡ What it does

### Core Features

✨ **AI-Powered Conversations**: Engage in intelligent discussions with AI personas that accurately represent Hitesh Choudhary and Piyush Garg's teaching styles and expertise

🎨 **Modern UI/UX**: Beautiful, responsive interface with smooth animations and transitions powered by Framer Motion

💬 **Real-time Chat**: Instant message processing with typing indicators and loading states for seamless user experience

🔒 **Rate Limiting**: Built-in protection with 10 messages per hour limit to prevent API abuse while ensuring fair usage

📝 **Session Management**: Persistent conversation history during active sessions with automatic context management

⌨️ **Keyboard Shortcuts**: Quick navigation with keyboard shortcuts (Ctrl+K to focus input, Ctrl+H for history)

🎭 **Persona Switching**: Easy switching between different AI mentors with distinct conversation contexts

📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices with adaptive layouts

🛡️ **Error Handling**: Comprehensive error management with user-friendly feedback messages

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js + TypeScript)              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Landing   │  │    Chat     │  │    UI Components        │  │
│  │    Page     │  │  Interface  │  │  (Radix UI + Tailwind)  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API Routes (/api/chat)                     │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Hitesh    │  │   Piyush    │  │    Rate Limiter +       │  │
│  │   Route     │  │   Route     │  │   Session Manager       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   GitHub Models API                             │
├─────────────────────────────────────────────────────────────────┤
│              OpenAI GPT-4o with Custom Prompts                 │
└─────────────────────────────────────────────────────────────────┘
```

### Component Structure

- **Landing Page**: Persona selection with animated cards and smooth transitions
- **Chat Interface**: Real-time messaging with modern chat bubbles and typing indicators
- **API Layer**: RESTful endpoints handling authentication, rate limiting, and AI integration
- **Session Management**: In-memory conversation tracking with context preservation
- **Rate Limiter**: Token-bucket algorithm preventing API abuse

## 🔄 How it works

### Application Flow

1. **Persona Selection**: User lands on the homepage and selects either Hitesh Choudhary or Piyush Garg persona through beautifully animated cards

2. **Chat Initialization**: The chat interface loads with a welcome message tailored to the selected persona's communication style

3. **Message Processing**: When a user sends a message:
   - Input validation occurs on the frontend
   - Rate limiting checks are performed (10 messages/hour limit)
   - Message is sent to the appropriate API route (`/api/chat/hitesh` or `/api/chat/piyush`)

4. **AI Integration**: Backend processes the request:
   - Retrieves or creates session-specific chat history
   - Applies persona-specific system prompts (extensive character descriptions)
   - Makes authenticated request to GitHub Models API using OpenAI GPT-4o
   - Implements token rotation for reliability

5. **Response Generation**: AI generates contextually appropriate responses based on:
   - The selected persona's teaching style and communication patterns
   - Conversation history for context continuity
   - Specific expertise areas and opinions of each mentor

6. **Real-time Updates**: Frontend receives the response and:
   - Updates the chat interface with smooth animations
   - Saves conversation to session storage
   - Maintains scroll position and focus management

7. **Error Handling**: Comprehensive error management handles:
   - API rate limits and authentication issues
   - Network connectivity problems
   - Invalid input validation
   - Graceful fallbacks with user-friendly messages

## 🚀 Setup

### Prerequisites

- **Node.js**: Version 18.0 or higher
- **npm** or **yarn**: Latest version
- **GitHub Personal Access Token**: With access to GitHub Models API

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd persona-ai
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   ```bash
   # Copy the environment example file
   cp env.example .env.local
   ```

4. **Configure GitHub Token**
   - Visit [GitHub Personal Access Tokens](https://github.com/settings/tokens)
   - Generate a new token with access to GitHub Models
   - Copy the token to your `.env.local` file:
     ```env
     GITHUB_TOKEN=your_github_token_here
     ```

5. **Verify Setup**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000` to see the application running.

### GitHub Models API Access

To use GitHub Models API:
1. Ensure you have access to GitHub Models (currently in beta)
2. Your GitHub token should have appropriate permissions
3. The application uses the `openai/gpt-4o` model through GitHub's infrastructure

## 📱 Usage

### Getting Started

1. **Start Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

2. **Select a Persona**
   - Click on **Hitesh Choudhary** for Hindi-English mixed responses with practical coding advice
   - Click on **Piyush Garg** for direct, honest tech guidance and AI-focused discussions

3. **Start Conversation**
   - Type your message in the chat input field
   - Press Enter or click the Send button
   - Wait for the AI response (typically 2-5 seconds)

### Tips for Best Experience

- **Ask Specific Questions**: Both personas respond better to specific technical questions rather than generic greetings
- **Mention Technologies**: Reference specific frameworks, languages, or tools for detailed responses
- **Seek Practical Advice**: Ask about project ideas, career guidance, or learning paths
- **Use Natural Language**: No need for formal language; both personas appreciate casual, conversational tone

### Keyboard Shortcuts

- **Ctrl/Cmd + K**: Focus on message input field
- **Ctrl/Cmd + H**: Open chat history
- **Ctrl/Cmd + /**: View keyboard shortcuts
- **Enter**: Send message
- **Escape**: Close modals or return to landing page

### Rate Limiting

- **Limit**: 10 messages per hour per user
- **Reset**: Automatically resets every hour
- **Indicator**: Remaining messages shown in the header
- **Exceeded**: Clear notification with reset time information

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Guidelines

1. **Fork the Repository** and create your feature branch
2. **Follow Code Standards**: TypeScript, ESLint, and Prettier configurations
3. **Test Thoroughly**: Ensure your changes work across different personas
4. **Document Changes**: Update README if adding new features
5. **Submit Pull Request**: With clear description of changes

### Areas for Contribution

- **New Personas**: Add additional tech mentors with their unique styles
- **UI Enhancements**: Improve animations, themes, or responsiveness
- **Features**: Add voice chat, message export, or advanced session management
- **Performance**: Optimize API calls, caching, or bundle size
- **Accessibility**: Improve keyboard navigation and screen reader support

## 🐛 Troubleshooting

### Common Issues

#### "API configuration error"
- **Cause**: Invalid or missing GitHub token
- **Solution**: Verify your `GITHUB_TOKEN` in `.env.local` and ensure it has Models API access

#### "Rate limit exceeded"
- **Cause**: More than 10 messages sent in the current hour
- **Solution**: Wait for the rate limit to reset (shown in error message)

#### "Failed to generate response"
- **Cause**: Temporary API issues or network connectivity
- **Solution**: Try again in a few moments; check your internet connection

#### Slow Response Times
- **Cause**: High API load or complex prompts
- **Solution**: Responses typically take 2-5 seconds; longer prompts may take more time

#### Messages Not Saving
- **Cause**: Browser storage limitations or session issues
- **Solution**: Refresh the page; session data is stored in memory and resets on reload

### Development Issues

#### Build Failures
```bash
# Clear cache and reinstall dependencies
rm -rf .next node_modules
npm install
npm run build
```

#### TypeScript Errors
```bash
# Check for type errors
npm run lint
npx tsc --noEmit
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

Special thanks to:

- **[Hitesh Choudhary](https://github.com/hiteshchoudhary)** - Renowned coding instructor and mentor whose teaching style inspired one of our AI personas
- **[Piyush Garg](https://github.com/piyush-garg)** - AI Engineer and educator whose expertise shaped our second AI persona
- **OpenAI** - For providing the powerful GPT-4o model that drives our conversations
- **GitHub** - For the Models API that makes this integration possible
- **Vercel** - For the excellent Next.js framework and deployment platform

### Disclaimer

This application creates AI personas inspired by real individuals for educational and entertainment purposes. The AI responses are generated based on publicly available content and should not be considered as official statements or advice from the actual persons.

---

**Made with ❤️ by Tarun Kumar**