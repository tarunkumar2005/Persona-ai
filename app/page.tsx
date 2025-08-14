"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LandingPage } from "@/components/landing-page"
import { ChatInterface } from "@/components/chat-interface"

const personas = [
  {
    id: "hitesh",
    name: "Hitesh Choudhary",
    avatar: "/hitesh.png",
    gradient: "from-purple-400 to-pink-500",
  },
  {
    id: "piyush",
    name: "Piyush Garg",
    avatar: "/piyush.png",
    gradient: "from-blue-400 to-purple-500",
  },
]

const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  in: { opacity: 1, scale: 1 },
  out: { opacity: 0, scale: 1.05 },
}

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.6,
}

export default function HomePage() {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handlePersonaSelect = (personaId: string) => {
    setSelectedPersona(personaId)
  }

  const handleBack = () => {
    setSelectedPersona(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 font-medium"
          >
            Loading MindBridge...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  const currentPersona = selectedPersona ? personas.find((p) => p.id === selectedPersona) : null

  return (
    <AnimatePresence mode="wait">
      {!selectedPersona ? (
        <motion.div
          key="landing"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <LandingPage personas={personas} onPersonaSelect={handlePersonaSelect} />
        </motion.div>
      ) : (
        <motion.div
          key="chat"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          {currentPersona && <ChatInterface persona={currentPersona} onBack={handleBack} />}
        </motion.div>
      )}
    </AnimatePresence>
  )
}