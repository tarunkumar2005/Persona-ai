import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "MindBridge - AI Persona Conversations",
  description:
    "Connect with AI personas of tech educators and industry experts. Have meaningful conversations with Hitesh Choudhary, Piyush Garg, and more.",
  keywords: ["AI chat", "tech education", "programming", "coding", "mentorship", "AI conversations"],
  authors: [{ name: "MindBridge Team" }],
  creator: "MindBridge",
  publisher: "MindBridge",
  robots: "index, follow",
  openGraph: {
    title: "MindBridge - AI Persona Conversations",
    description: "Connect with AI personas of tech educators and industry experts",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MindBridge - AI Persona Conversations",
    description: "Connect with AI personas of tech educators and industry experts",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#8B5CF6",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}