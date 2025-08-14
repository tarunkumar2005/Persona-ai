"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Sparkles, Zap, Heart } from "lucide-react"
import { useRef } from "react"

interface Persona {
  id: string
  name: string
  avatar: string
  gradient: string
}

interface LandingPageProps {
  personas: Persona[]
  onPersonaSelect: (personaId: string) => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

const floatingVariants = {
  animate: {
    y: [-30, 30, -30],
    x: [-20, 20, -20],
    rotate: [0, 10, -10, 0],
    scale: [1, 1.1, 0.9, 1],
    transition: {
      duration: 12,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}

const sparkleVariants = {
  animate: {
    scale: [0, 1, 0],
    rotate: [0, 180, 360],
    opacity: [0, 1, 0],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}

export function LandingPage({ personas, onPersonaSelect }: LandingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden">
      {/* Enhanced animated background */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20" />

        {/* Multiple floating elements with different animations */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-200/25 to-purple-200/30 rounded-full blur-3xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "2s" }}
          className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-l from-blue-200/35 to-indigo-200/25 rounded-full blur-2xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "4s" }}
          className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-pink-200/25 rounded-full blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "6s" }}
          className="absolute top-1/2 right-1/3 w-48 h-48 bg-gradient-to-tl from-cyan-200/20 to-blue-200/15 rounded-full blur-2xl"
        />

        {/* Animated sparkles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            variants={sparkleVariants}
            animate="animate"
            style={{
              animationDelay: `${i * 0.5}s`,
              left: `${20 + i * 10}%`,
              top: `${15 + i * 8}%`,
            }}
            className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
          />
        ))}

        {/* Grid pattern with animation */}
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139,92,246,0.15) 1px, transparent 0)`,
            backgroundSize: "30px 30px",
          }}
        />
      </motion.div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          style={{ y: textY }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto text-center"
        >
          {/* Enhanced header section */}
          <motion.div variants={itemVariants} className="mb-20">
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "backOut" }}
              className="mb-8"
            >
              <motion.span
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="inline-flex items-center gap-2 px-8 py-3 bg-white/70 backdrop-blur-md rounded-full text-gray-700 font-semibold text-base border border-white/40 shadow-xl cursor-pointer"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </motion.div>
                MindBridge - Connect & Converse
              </motion.span>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <motion.h1
                className="text-9xl font-black mb-10 tracking-tight leading-none"
                style={{
                  background: "linear-gradient(135deg, #1f2937 0%, #6b7280 50%, #9ca3af 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                <motion.span
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  Smart
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="text-gray-600"
                >
                  Conversations
                </motion.span>
              </motion.h1>

              {/* Animated underline */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="text-2xl text-gray-700 max-w-5xl mx-auto leading-relaxed font-light mb-6 mt-12"
            >
              <span>
                Experience the future of AI conversations with personalities that understand, engage, and inspire.
              </span>
              <br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-xl text-gray-600 mt-4 block font-normal"
              >
                Get personalized insights, learn from experts, and enjoy discussions that feel genuinely human.
              </motion.span>
            </motion.div>

            {/* Enhanced feature indicators */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-12 mt-12 text-sm text-gray-600"
            >
              {[
                { icon: Zap, color: "emerald", text: "Instant Responses", delay: 0 },
                { icon: Heart, color: "rose", text: "Natural Feel", delay: 0.5 },
                { icon: Sparkles, color: "violet", text: "AI Powered", delay: 1 },
              ].map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 + item.delay, duration: 0.6 }}
                  className="flex items-center gap-3 group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: index * 0.7,
                    }}
                    className={`w-3 h-3 bg-${item.color}-500 rounded-full shadow-lg`}
                  />
                  <item.icon
                    className={`w-5 h-5 text-${item.color}-600 group-hover:text-${item.color}-700 transition-colors`}
                  />
                  <span className="font-medium group-hover:text-gray-800 transition-colors">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div variants={containerVariants} className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
            {personas.map((persona, index) => (
              <motion.div
                key={persona.id}
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  y: -20,
                  rotateY: 3,
                  rotateX: 2,
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.5, ease: "backOut" }}
                style={{ perspective: "1000px" }}
                className="cursor-pointer"
                onClick={() => onPersonaSelect(persona.id)}
              >
                <Card className="relative overflow-hidden rounded-3xl p-0 border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-xl">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  />

                  <motion.div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        "linear-gradient(45deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2), rgba(59,130,246,0.2))",
                      filter: "blur(2px)",
                    }}
                    animate={{
                      background: [
                        "linear-gradient(45deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2), rgba(59,130,246,0.2))",
                        "linear-gradient(90deg, rgba(236,72,153,0.2), rgba(59,130,246,0.2), rgba(139,92,246,0.2))",
                        "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2), rgba(236,72,153,0.2))",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  />

                  <div className="relative z-10 p-12">
                    <motion.div
                      className="relative mb-8 flex justify-center"
                      whileHover={{
                        scale: 1.1,
                        rotate: [0, -2, 2, 0],
                      }}
                      transition={{ duration: 0.6, ease: "backOut" }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full -z-10"
                        animate={{
                          background: [
                            "conic-gradient(from 0deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2), rgba(59,130,246,0.2), rgba(139,92,246,0.2))",
                            "conic-gradient(from 120deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2), rgba(59,130,246,0.2), rgba(139,92,246,0.2))",
                            "conic-gradient(from 240deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2), rgba(59,130,246,0.2), rgba(139,92,246,0.2))",
                          ],
                          rotate: [0, 360],
                        }}
                        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        style={{ width: "200px", height: "200px", filter: "blur(12px)", left: "-10px", top: "-10px" }}
                      />

                      <Avatar className="w-40 h-40 ring-4 ring-white/80 shadow-2xl relative z-20 transition-all duration-700 hover:ring-white/90 cursor-pointer">
                        <AvatarImage
                          src={persona.avatar || "/placeholder.svg"}
                          alt={persona.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                          {persona.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <motion.div
                        className="absolute -bottom-1 -right-1 w-14 h-14 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center z-30 cursor-pointer"
                        animate={{
                          scale: [1, 1.1, 1],
                          boxShadow: [
                            "0 0 0 0 rgba(34,197,94,0.4)",
                            "0 0 0 15px rgba(34,197,94,0)",
                            "0 0 0 0 rgba(34,197,94,0)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <motion.div
                          animate={{ scale: [1, 0.8, 1] }}
                          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                          className="w-6 h-6 bg-white rounded-full shadow-inner"
                        />
                      </motion.div>

                      {Array.from({ length: 6 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg z-10"
                          animate={{
                            scale: [0, 1, 0],
                            rotate: [0, 180, 360],
                            opacity: [0, 0.8, 0],
                            x: [0, Math.cos((i * 60 * Math.PI) / 180) * 50, 0],
                            y: [0, Math.sin((i * 60 * Math.PI) / 180) * 50, 0],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.3,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </motion.div>

                    <motion.h3
                      className="text-4xl font-black mb-8 text-center tracking-tight"
                      style={{
                        background: "linear-gradient(135deg, #1f2937 0%, #4b5563 50%, #6b7280 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                      whileHover={{
                        scale: 1.05,
                        filter: "drop-shadow(0 0 20px rgba(139,92,246,0.3))",
                      }}
                    >
                      {persona.name}
                    </motion.h3>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative">
                      <Button className="w-full relative overflow-hidden rounded-2xl py-6 text-lg font-bold bg-gradient-to-r from-white/90 to-white/80 text-gray-800 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-700 hover:from-white/95 hover:to-white/90 hover:border-white/70 backdrop-blur-sm cursor-pointer">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.8, ease: "easeInOut" }}
                        />

                        <motion.div
                          className="relative flex items-center justify-center gap-3 cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                        >
                          <motion.div
                            animate={{
                              rotate: [0, 15, -15, 0],
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                          >
                            <MessageCircle className="w-6 h-6 text-purple-600" />
                          </motion.div>
                          <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Start Conversation
                          </span>
                        </motion.div>
                      </Button>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}