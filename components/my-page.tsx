"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Crown } from "lucide-react"
import { translations, type Language } from "@/lib/translations"

interface MyPageProps {
  user: any
  onBack: () => void
  language: Language
}

export function MyPage({ user, onBack, language }: MyPageProps) {
  const t = (key: string) => translations[language][key] || key

  const getInterestEmoji = (interest: string) => {
    const emojis = {
      design: "🎨",
      programming: "💻",
      cooking: "🍳",
      music: "🎵",
      language: "🌍",
      business: "📊",
    }
    return emojis[interest as keyof typeof emojis] || "📚"
  }

  const getLevelColor = (level: string) => {
    const colors = {
      초급: "bg-green-100 text-green-700",
      중급: "bg-yellow-100 text-yellow-700",
      상급: "bg-red-100 text-red-700",
    }
    return colors[level as keyof typeof colors] || "bg-gray-100 text-gray-700"
  }

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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  🤖
                </div>
                <CardTitle className="flex items-center justify-center gap-2">{user.name}</CardTitle>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {user.isSubscribed ? (
                    <Badge className="bg-yellow-100 text-yellow-700">
                      <Crown className="w-3 h-3 mr-1" />
                      {t("premium-member")}
                    </Badge>
                  ) : (
                    <Badge variant="outline">{t("free-member")}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {t("join-date")}: {new Date(user.joinDate).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>{t("email")}:</strong> {user.email}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Profile */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("learning-profile")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {user.profile ? (
                  <>
                    <div>
                      <h3 className="font-semibold mb-2">{t("basic-info")}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">{t("label-name")}:</span>
                          <span className="ml-2">{user.profile.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">{t("label-age")}:</span>
                          <span className="ml-2">{user.profile.age}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">{t("interests-and-levels")}</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {user.profile.interests.map((interest: string) => (
                          <div key={interest} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getInterestEmoji(interest)}</span>
                              <span className="font-medium">{t(`interest-${interest}`)}</span>
                            </div>
                            <Badge className={getLevelColor(user.profile.skillLevels[interest] || "초급")}>
                              {user.profile.skillLevels[interest] || "초급"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {user.profile.goal && (
                      <div>
                        <h3 className="font-semibold mb-2">{t("learning-goal")}</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700">{user.profile.goal}</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">{t("no-profile-data")}</p>
                    <Button onClick={onBack} variant="outline">
                      {t("create-profile")}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Learning Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{t("learning-stats")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600">{t("completed-videos")}</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-gray-600">{t("study-hours")}</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <div className="text-sm text-gray-600">{t("certificates")}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
