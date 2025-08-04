"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { translations, type Language } from "@/lib/translations"

interface Video {
  title: string
  level: string
  description: string
  category: string
}

interface UserProfile {
  name: string
  age: string
  interests: string[]
  skillLevels: Record<string, string>
  goal: string
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface AIChatProps {
  video: Video
  userProfile: UserProfile
  language: Language
}

export function AIChat({ video, userProfile, language }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const t = (key: string) => translations[language][key] || key

  useEffect(() => {
    // Initialize with welcome message
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: t("ai-welcome"),
      },
    ])
  }, [language])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText.trim(),
          video,
          userProfile,
          language,
          messages: messages.slice(-5), // Send last 5 messages for context
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.message) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message,
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        throw new Error("No message in response")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          language === "ja"
            ? "すみません、エラーが発生しました。もう一度お試しください。"
            : "죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    sendMessage(input)
    setInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const askQuickQuestion = (question: string) => {
    sendMessage(question)
  }

  const quickQuestions = [t("quick-q1"), t("quick-q2"), t("quick-q3")]

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center">
          🤖 <span className="ml-2">{t("ai-assistant")}</span>
        </CardTitle>
        <p className="text-sm text-gray-600">{t("ai-help-text")}</p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto max-h-96 mb-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-green-400 to-purple-400 text-white ml-8"
                    : "bg-gray-100 text-gray-800 mr-8"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="text-xs text-gray-600 mb-1">AI {t("ai-assistant")}</div>
                )}
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg mr-8">
                <div className="text-xs text-gray-600 mb-1">AI {t("ai-assistant")}</div>
                <div className="text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="space-y-3">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t("chat-placeholder")}
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-green-400 to-purple-400 hover:from-green-500 hover:to-purple-500"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>

          <div>
            <div className="text-xs text-gray-500 mb-2">{t("quick-questions")}</div>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => askQuickQuestion(question)}
                  className="text-xs"
                  disabled={isLoading}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
