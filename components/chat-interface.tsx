"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LoadingDots } from "@/components/ui/loading-dots"
import { ArrowLeft, Send, Clock, AlertCircle, History, Keyboard, MoreVertical } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { RateLimiter } from "@/lib/rate-limiter"
import { SessionManager, type ChatMessage } from "@/lib/session-manager"
import { ChatHistory } from "@/components/features/chat-history"
import { KeyboardShortcuts } from "@/components/features/keyboard-shortcuts"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp?: number
}

interface Persona {
  id: string
  name: string
  avatar: string
  gradient: string
}

interface ChatInterfaceProps {
  persona: Persona
  onBack: () => void
}

const messageVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { duration: 0.3 },
  },
}

export function ChatInterface({ persona, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text:
        persona.id === "hitesh"
          ? "Hanji! Namaste, main Hitesh hoon. Chai aur Code ke saath coding seekhte hain. Kya help chahiye aaj?"
          : "Hello! I'm Piyush. Ready to dive into some coding concepts? What would you like to learn today?",
      sender: "ai",
      timestamp: Date.now(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [rateLimitInfo, setRateLimitInfo] = useState({
    allowed: true,
    remaining: 10,
    resetTime: 0,
  })
  const [showRateLimit, setShowRateLimit] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const sessionId = `${persona.id}-session`

  // Load session on mount
  useEffect(() => {
    const savedMessages = SessionManager.loadSession(sessionId)
    if (savedMessages.length > 0) {
      setMessages(savedMessages)
    }
  }, [sessionId])

  // Save session when messages change
  useEffect(() => {
    if (messages.length > 1) {
      // Don't save just the welcome message
      // Ensure all messages have timestamps before saving
      const messagesWithTimestamps = messages.map((msg) => ({
        ...msg,
        timestamp: msg.timestamp ?? Date.now(),
      })) as ChatMessage[]

      SessionManager.saveSession(sessionId, messagesWithTimestamps)
    }
  }, [messages, sessionId])

  useEffect(() => {
    const updateRateLimit = () => {
      const info = RateLimiter.canSendMessage()
      setRateLimitInfo(info)
    }

    updateRateLimit()
    const interval = setInterval(updateRateLimit, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "k":
            e.preventDefault()
            document.querySelector<HTMLInputElement>('input[type="text"]')?.focus()
            break
          case "h":
            e.preventDefault()
            setShowHistory(true)
            break
          case "/":
            e.preventDefault()
            setShowShortcuts(true)
            break
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputText.trim() || isProcessing) return

    const rateLimitCheck = RateLimiter.canSendMessage()
    if (!rateLimitCheck.allowed) {
      setShowRateLimit(true)
      setTimeout(() => setShowRateLimit(false), 5000)
      return
    }

    RateLimiter.recordMessage()
    setRateLimitInfo(RateLimiter.canSendMessage())

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsProcessing(true)

    try {
      const response = await fetch(`/api/chat/${persona.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputText,
          sessionId: sessionId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Add AI response to messages
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: data.response,
        sender: "ai",
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsProcessing(false)
    } catch (error) {
      console.error("Error sending message:", error)
      setIsProcessing(false)

      const errorMessage: Message = {
        id: Date.now().toString(),
        text:
          persona.id === "hitesh"
            ? "Yar, kuch technical problem aa gayi. Phir se try karo!"
            : "Sorry, I encountered an error. Please try again.",
        sender: "ai",
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-purple-50/20 to-pink-50/10" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(229,231,235,0.2) 1px, transparent 0)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card border-b border-white/15 p-4 relative z-10 shadow-sm"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-gray-700 hover:text-gray-900 hover:bg-white/20 rounded-xl px-4 py-2 transition-all duration-300 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </motion.div>

            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Avatar className="w-12 h-12 ring-2 ring-white/20 shadow-md">
                <AvatarImage src={persona.avatar || "/placeholder.svg"} alt={persona.name} />
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-600 text-white">
                  {persona.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="font-semibold text-gray-800">{persona.name}</h2>
              <div className="text-sm text-gray-600 flex items-center gap-1">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 0.1,
                  }}
                  className="w-2 h-2 bg-green-500 rounded-full"
                />
                {isProcessing ? "Thinking..." : "Online"}
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-2 text-sm text-gray-600"
            >
              <Clock className="w-4 h-4" />
              <span>{rateLimitInfo.remaining}/10 chats remaining</span>
            </motion.div>

            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
                className="text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-48 glass-card rounded-xl border border-white/20 shadow-xl z-20"
                  >
                    <div className="p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowHistory(true)
                          setShowMenu(false)
                        }}
                        className="w-full justify-start text-gray-700 hover:text-gray-900 cursor-pointer"
                      >
                        <History className="w-4 h-4 mr-2" />
                        Chat History
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowShortcuts(true)
                          setShowMenu(false)
                        }}
                        className="w-full justify-start text-gray-700 hover:text-gray-900 cursor-pointer"
                      >
                        <Keyboard className="w-4 h-4 mr-2" />
                        Shortcuts
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showRateLimit && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="relative z-20 mx-4 mt-4"
          >
            <div className="max-w-4xl mx-auto">
              <div className="glass-card border border-orange-200/50 bg-orange-50/80 p-4 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-orange-800 font-medium">Chat limit reached</p>
                  <p className="text-orange-700 text-sm">
                    You've used all 10 chats for this hour. Try again in {RateLimiter.getRemainingTime()}.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 relative z-10">
        <div className="max-w-4xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-purple-200"
                      : "glass-card text-gray-800 shadow-white/50"
                  }`}
                >
                  {message.text}
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start"
              >
                <div className="glass-card px-4 py-3 rounded-2xl shadow-sm border border-gray-200/30">
                  <LoadingDots className="text-purple-500" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card border-t border-white/15 p-4 relative z-10 shadow-sm"
      >
        <div className="max-w-4xl mx-auto flex gap-3">
          <div className="flex-1 relative">
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder="Type your message..."
              disabled={isProcessing}
              className="w-full glass rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 border border-white/15 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400/30 shadow-sm transition-all duration-300 disabled:opacity-50"
            />
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={sendMessage}
              disabled={isProcessing || !inputText.trim() || !rateLimitInfo.allowed}
              className="glass rounded-xl px-6 py-3 text-gray-700 hover:bg-white/30 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? <LoadingDots className="text-purple-500" /> : <Send className="w-5 h-5" />}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <ChatHistory sessionId={sessionId} isOpen={showHistory} onClose={() => setShowHistory(false)} />
      <KeyboardShortcuts isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />

      {showMenu && <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />}
    </div>
  )
}