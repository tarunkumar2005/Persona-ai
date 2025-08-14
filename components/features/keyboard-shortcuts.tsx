"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Keyboard, Command } from "lucide-react"

interface KeyboardShortcutsProps {
  isOpen: boolean
  onClose: () => void
}

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  const shortcuts = [
    { key: "Enter", description: "Send message" },
    { key: "Shift + Enter", description: "New line in message" },
    { key: "Ctrl + K", description: "Focus message input" },
    { key: "Ctrl + H", description: "Toggle chat history" },
    { key: "Ctrl + /", description: "Show keyboard shortcuts" },
    { key: "Escape", description: "Close dialogs" },
    { key: "Space", description: "Start/stop voice recording (when focused)" },
  ]

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
            className="glass-card rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-6">
              <Keyboard className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">Keyboard Shortcuts</h2>
            </div>

            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => (
                <motion.div
                  key={shortcut.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between py-2"
                >
                  <span className="text-gray-700">{shortcut.description}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.key.split(" + ").map((key, keyIndex) => (
                      <div key={keyIndex} className="flex items-center gap-1">
                        {keyIndex > 0 && <span className="text-gray-400">+</span>}
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
                          {key === "Ctrl" ? <Command className="w-3 h-3" /> : key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">Press Escape to close</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}