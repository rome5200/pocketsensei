"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { translations, type Language } from "@/lib/translations"

interface User {
  id: string
  email: string
  name: string
  isSubscribed: boolean
  profile?: any
  joinDate: string
}

interface UserProfile {
  name: string
  age: string
  interests: string[]
  skillLevels: Record<string, string>
  goal: string
}

interface SignupPageProps {
  onSignup: (user: User, profile: UserProfile) => void
  onSwitchToLogin: () => void
  language: Language
}

export function SignupPage({ onSignup, onSwitchToLogin, language }: SignupPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Account info, 2: Profile info

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    age: "",
    interests: [],
    skillLevels: {},
    goal: "",
  })

  const t = (key: string) => translations[language][key] || key

  const interests = [
    { value: "design", emoji: "🎨", key: "interest-design" },
    { value: "programming", emoji: "💻", key: "interest-programming" },
    { value: "cooking", emoji: "🍳", key: "interest-cooking" },
    { value: "music", emoji: "🎵", key: "interest-music" },
    { value: "language", emoji: "🌍", key: "interest-language" },
    { value: "business", emoji: "📊", key: "interest-business" },
  ]

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert(t("password-mismatch"))
      return
    }
    setStep(2)
  }

  const handleInterestChange = (interest: string, checked: boolean) => {
    setProfile((prev) => ({
      ...prev,
      interests: checked ? [...prev.interests, interest] : prev.interests.filter((i) => i !== interest),
    }))
  }

  const handleSkillLevelChange = (interest: string, level: string) => {
    setProfile((prev) => ({
      ...prev,
      skillLevels: { ...prev.skillLevels, [interest]: level },
    }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name: profile.name,
        isSubscribed: false,
        profile,
        joinDate: new Date().toISOString(),
      }

      // Save to localStorage (simple demo)
      const existingUsers = JSON.parse(localStorage.getItem("learnmate_users") || "[]")
      const userWithPassword = { ...newUser, password }
      existingUsers.push(userWithPassword)
      localStorage.setItem("learnmate_users", JSON.stringify(existingUsers))

      // Show success message before redirecting
      alert(t("signup-success"))

      onSignup(newUser, profile)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="/images/pocket-teacher-logo.png" alt="포켓쌤" className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-800">{t("service-name")}</span>
          </div>
          <CardTitle className="text-2xl">{t("signup-title")}</CardTitle>
          <p className="text-gray-600">{step === 1 ? t("signup-subtitle-step1") : t("signup-subtitle-step2")}</p>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              <div className={`w-3 h-3 rounded-full ${step >= 1 ? "bg-green-400" : "bg-gray-300"}`} />
              <div className={`w-3 h-3 rounded-full ${step >= 2 ? "bg-green-400" : "bg-gray-300"}`} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleAccountSubmit} className="space-y-4">
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
              <div>
                <label className="block text-sm font-medium mb-2">{t("label-confirm-password")}</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-400 to-purple-400 hover:from-green-500 hover:to-purple-500"
              >
                {t("next-step")}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t("label-name")}</label>
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="홍길동"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t("label-age")}</label>
                <Select value={profile.age} onValueChange={(value) => setProfile((prev) => ({ ...prev, age: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("select-placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10대">10대</SelectItem>
                    <SelectItem value="20대">20대</SelectItem>
                    <SelectItem value="30대">30대</SelectItem>
                    <SelectItem value="40대">40대</SelectItem>
                    <SelectItem value="50대이상">50대이상</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">{t("label-interests")}</label>
                <div className="grid grid-cols-2 gap-3">
                  {interests.map((interest) => (
                    <div key={interest.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest.value}
                        checked={profile.interests.includes(interest.value)}
                        onCheckedChange={(checked) => handleInterestChange(interest.value, checked as boolean)}
                      />
                      <label htmlFor={interest.value} className="text-sm cursor-pointer">
                        {interest.emoji} {t(interest.key)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {profile.interests.length > 0 && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium">{t("skill-levels")}</label>
                  {profile.interests.map((interest) => (
                    <div key={interest} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm font-medium">{t(`interest-${interest}`)}</span>
                      <Select
                        value={profile.skillLevels[interest] || ""}
                        onValueChange={(value) => handleSkillLevelChange(interest, value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="초급">초급</SelectItem>
                          <SelectItem value="중급">중급</SelectItem>
                          <SelectItem value="상급">상급</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">{t("label-goal")}</label>
                <Textarea
                  value={profile.goal}
                  onChange={(e) => setProfile((prev) => ({ ...prev, goal: e.target.value }))}
                  placeholder={t("goal-placeholder")}
                  className="h-24 resize-none"
                />
              </div>

              <div className="flex space-x-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  {t("previous-step")}
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-400 to-purple-400 hover:from-green-500 hover:to-purple-500"
                  disabled={isLoading}
                >
                  {isLoading ? t("creating-account") : t("create-account")}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t("have-account")}{" "}
              <button onClick={onSwitchToLogin} className="text-green-600 hover:text-green-700 font-medium">
                {t("login-link")}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
