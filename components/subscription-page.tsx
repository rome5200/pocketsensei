"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, Crown, Play, MessageCircle, BookOpen } from "lucide-react"
import { translations, type Language } from "@/lib/translations"

interface User {
  id: string
  email: string
  name: string
  isSubscribed: boolean
  profile?: any
  joinDate: string
}

interface SubscriptionPageProps {
  user: User | null
  onSubscribe: (user: User) => void
  onBack: () => void
  language: Language
}

export function SubscriptionPage({ user, onSubscribe, onBack, language }: SubscriptionPageProps) {
  const t = (key: string) => translations[language][key] || key

  const handleSubscribe = () => {
    if (user) {
      const updatedUser = { ...user, isSubscribed: true }

      // Update localStorage
      const existingUsers = JSON.parse(localStorage.getItem("learnmate_users") || "[]")
      const userIndex = existingUsers.findIndex((u: any) => u.id === user.id)
      if (userIndex !== -1) {
        existingUsers[userIndex] = { ...existingUsers[userIndex], isSubscribed: true }
        localStorage.setItem("learnmate_users", JSON.stringify(existingUsers))
      }

      onSubscribe(updatedUser)
    }
  }

  const features = [
    { icon: Play, key: "feature-unlimited-videos" },
    { icon: MessageCircle, key: "feature-ai-chat" },
    { icon: BookOpen, key: "feature-learning-path" },
    { icon: Crown, key: "feature-premium-content" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/images/pocket-teacher-logo.png" alt="포켓쌤" className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-800">{t("service-name")}</span>
          </div>
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>{t("back-button")}</span>
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("subscription-title")}</h1>
          <p className="text-xl text-gray-600">{t("subscription-subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t("free-plan")}</span>
                <Badge variant="outline">{t("current-plan")}</Badge>
              </CardTitle>
              <div className="text-3xl font-bold">₩0</div>
              <p className="text-gray-600">{t("free-plan-desc")}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-sm">{t("free-feature-1")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-sm">{t("free-feature-2")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-sm">{t("free-feature-3")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-2 border-yellow-400 shadow-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-yellow-400 text-yellow-900 px-4 py-1">
                <Crown className="w-4 h-4 mr-1" />
                {t("recommended")}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t("premium-plan")}</span>
              </CardTitle>
              <div className="text-3xl font-bold">
                ₩9,900
                <span className="text-lg font-normal text-gray-600">/{t("month")}</span>
              </div>
              <p className="text-gray-600">{t("premium-plan-desc")}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <feature.icon className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">{t(feature.key)}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleSubscribe}
                className="w-full bg-gradient-to-r from-green-400 to-purple-400 hover:from-green-500 hover:to-purple-500 text-white font-semibold py-3"
              >
                <Crown className="w-4 h-4 mr-2" />
                {t("subscribe-now")}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">{t("why-premium")}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6">
                <feature.icon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{t(feature.key)}</h3>
                <p className="text-sm text-gray-600">{t(`${feature.key}-desc`)}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
