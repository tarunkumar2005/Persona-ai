"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, Trash2, Download, Clock } from "lucide-react"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: number
}

interface ChatHistoryProps {
  sessionId: string
  isOpen: boolean
  onClose: () => void
}

export function ChatHistory({ sessionId, isOpen, onClose }: ChatHistoryProps) {
  const [history, setHistory] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && sessionId) {
      fetchHistory()
    }
  }, [isOpen, sessionId])

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/chat/${sessionId.split("-")[0]}?sessionId=${sessionId}`)
      const data = await response.json()
      if (data.exists) {
        setHistory(data.history)
      }
    } catch (error) {
      console.error("Failed to fetch history:", error)
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = async () => {
    try {
      await fetch(`/api/chat/${sessionId.split("-")[0]}?sessionId=${sessionId}&confirm=true`, {
        method: "DELETE",
      })
      setHistory([])
    } catch (error) {
      console.error("Failed to clear history:", error)
    }
  }

  const exportHistory = () => {
    const exportData = {
      sessionId,
      exportedAt: new Date().toISOString(),
      messages: history,
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chat-history-${sessionId}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <History className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-800">Chat History</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={exportHistory} disabled={history.length === 0}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={clearHistory} disabled={history.length === 0}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full" />
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No chat history found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-xl ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                            : "glass text-gray-800"
                        }`}
                      >
                        <p className="text-sm mb-1">{message.content}</p>
                        <div className="flex items-center gap-1 text-xs opacity-70">
                          <Clock className="w-3 h-3" />
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <div className="mt-6 flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}