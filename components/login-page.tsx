"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { translations, type Language } from "@/lib/translations"

interface User {
  id: string
  email: string
  name: string
  isSubscribed: boolean
  profile?: any
  joinDate: string
}

interface LoginPageProps {
  onLogin: (user: User) => void
  onSwitchToSignup: () => void
  language: Language
}

export function LoginPage({ onLogin, onSwitchToSignup, language }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const t = (key: string) => translations[language][key] || key

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Check if user exists in localStorage (simple demo)
      const existingUsers = JSON.parse(localStorage.getItem("learnmate_users") || "[]")
      const user = existingUsers.find((u: any) => u.email === email && u.password === password)

      if (user) {
        const { password: _, ...userWithoutPassword } = user
        onLogin(userWithoutPassword)
      } else {
        alert(t("login-failed"))
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="/images/pocket-teacher-logo.png" alt="포켓쌤" className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-800">{t("service-name")}</span>
          </div>
          <CardTitle className="text-2xl">{t("login-title")}</CardTitle>
          <p className="text-gray-600">{t("login-subtitle")}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t("label-email")}</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t("label-password")}</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-400 to-purple-400 hover:from-green-500 hover:to-purple-500"
              disabled={isLoading}
            >
              {isLoading ? t("logging-in") : t("login-button")}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t("no-account")}{" "}
              <button onClick={onSwitchToSignup} className="text-green-600 hover:text-green-700 font-medium">
                {t("signup-link")}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
