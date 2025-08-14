import type { NextRequest } from "next/server"
import { HITESH_CHOUDHARY_SYSTEM_PROMPT } from "@/lib/prompts"
import OpenAI from "openai"

// Token switcher utility
function getRandomToken(): string {
  const tokens = process.env.GITHUB_TOKEN?.split(",").map((token) => token.trim()) || []
  if (tokens.length === 0) {
    throw new Error("No GitHub tokens found in environment variables")
  }
  const randomIndex = Math.floor(Math.random() * tokens.length)
  return tokens[randomIndex]
}

// Initialize OpenAI client with GitHub Models
function createOpenAIClient() {
  return new OpenAI({
    baseURL: "https://models.github.ai/inference",
    apiKey: getRandomToken(),
    defaultHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "Smart Conversations App",
    },
  })
}

// In-memory chat history storage
const chatHistories = new Map<string, Array<{ role: string; content: string; timestamp: number }>>()

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId = "hitesh-default" } = await request.json()

    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 })
    }

    // Get or create chat history for this session
    if (!chatHistories.has(sessionId)) {
      chatHistories.set(sessionId, [])
    }

    const history = chatHistories.get(sessionId)!

    // Add user message to history
    history.push({
      role: "user",
      content: message,
      timestamp: Date.now(),
    })

    // Keep only last 20 messages to manage context length
    if (history.length > 20) {
      history.splice(0, history.length - 20)
    }

    // Prepare messages for API call
    const messages = [
      { role: "system" as const, content: HITESH_CHOUDHARY_SYSTEM_PROMPT },
      ...history.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    ]

    // Create OpenAI client with random token
    const openai = createOpenAIClient()

    try {
      const completion = await openai.chat.completions.create({
        model: "openai/gpt-4o",
        messages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false, // No streaming for simple response
      })

      const response = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response."

      // Add assistant response to history
      history.push({
        role: "assistant",
        content: response,
        timestamp: Date.now(),
      })

      return Response.json({
        response,
        sessionId,
        historyLength: history.length,
      })
    } catch (apiError) {
      console.error("OpenAI API Error:", apiError)

      // Handle specific API errors
      if (apiError instanceof Error) {
        if (apiError.message.includes("rate limit")) {
          return Response.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
        }
        if (apiError.message.includes("API key") || apiError.message.includes("authentication")) {
          return Response.json({ error: "API configuration error. Please check your GitHub tokens." }, { status: 500 })
        }
      }

      return Response.json({ error: "Failed to generate response. Please try again." }, { status: 500 })
    }
  } catch (error) {
    console.error("Chat API Error:", error)
    return Response.json({ error: "Failed to process request. Please try again." }, { status: 500 })
  }
}