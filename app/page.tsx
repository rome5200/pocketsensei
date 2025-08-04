"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Lock, User, LogOut, ChevronDown } from "lucide-react"
import { VideoPlayer } from "@/components/video-player"
import { translations, type Language } from "@/lib/translations"
import { AIChat } from "@/components/ai-chat"
import { LoginPage } from "@/components/login-page"
import { SignupPage } from "@/components/signup-page"
import { MyPage } from "@/components/my-page"
import { SubscriptionPage } from "@/components/subscription-page"
import { CoursesPage } from "@/components/courses-page"

interface UserProfile {
  name: string
  age: string
  interests: string[]
  skillLevels: Record<string, string>
  goal: string
}

interface Video {
  title: string
  level: string
  description: string
  category: string
}

type ViewType = "main" | "video" | "login" | "signup" | "mypage" | "subscription" | "courses"

export default function LearnMatePage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("ko")
  const [currentView, setCurrentView] = useState<ViewType>("main")
  const [user, setUser] = useState<{
    id: string
    email: string
    name: string
    isSubscribed: boolean
    profile?: UserProfile
    joinDate: string
  } | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    age: "",
    interests: [],
    skillLevels: {},
    goal: "",
  })
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [isAdminMode, setIsAdminMode] = useState(false)

  const t = (key: string) => translations[currentLanguage][key] || key

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("learnmate_user")
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      if (userData.profile) {
        setUserProfile(userData.profile)
      }
    }
  }, [])

  const interests = [
    { value: "design", emoji: "🎨", key: "interest-design" },
    { value: "programming", emoji: "💻", key: "interest-programming" },
    { value: "cooking", emoji: "🍳", key: "interest-cooking" },
    { value: "music", emoji: "🎵", key: "interest-music" },
    { value: "language", emoji: "🌍", key: "interest-language" },
    { value: "business", emoji: "📊", key: "interest-business" },
  ]

  const videoDatabase = {
    design: [
      { title: "Photoshop 기초강좌", level: "초급", description: "디자인의 기본 도구를 배우자", category: "design" },
      {
        title: "UI/UX 디자인 입문",
        level: "중급",
        description: "피그마로 시작하는 UI/UX 디자인 기초",
        category: "design",
      },
      { title: "브랜딩 디자인", level: "상급", description: "프로급 브랜드 구축", category: "design" },
    ],
    programming: [
      { title: "HTML/CSS 기초", level: "초급", description: "Web 페이지 작성의 첫걸음", category: "programming" },
      { title: "JavaScript 실천", level: "중급", description: "동적인 웹사이트를 만들자", category: "programming" },
      { title: "React 개발 마스터", level: "상급", description: "모던한 웹 앱 개발", category: "programming" },
    ],
    cooking: [
      { title: "기본 일식", level: "초급", description: "집밥의 기초를 배우자", category: "cooking" },
      { title: "이탈리안 요리", level: "중급", description: "본격적인 파스타와 피자", category: "cooking" },
      { title: "프렌치 기법", level: "상급", description: "전문 조리 기술을 마스터", category: "cooking" },
    ],
    music: [
      { title: "피아노 입문", level: "초급", description: "악보 읽는 법부터 시작", category: "music" },
      { title: "기타 연주", level: "중급", description: "좋아하는 곡을 연주하고 노래", category: "music" },
      { title: "작곡·편곡 강좌", level: "상급", description: "오리지널 악곡을 만들자", category: "music" },
    ],
    language: [
      { title: "영어회화 기초", level: "초급", description: "일상회화부터 시작하자", category: "language" },
      { title: "비즈니스 영어", level: "중급", description: "일에서 쓸 수 있는 영어실력", category: "language" },
      { title: "영어 프레젠테이션 기술", level: "상급", description: "설득력 있는 발표 스킬", category: "language" },
    ],
    business: [
      { title: "마케팅 기초", level: "초급", description: "고객심리를 이해하자", category: "business" },
      { title: "데이터 분석 입문", level: "중급", description: "Excel로 시작하는 데이터 활용", category: "business" },
      { title: "경영전략론", level: "상급", description: "사업성장을 위한 전략사고", category: "business" },
    ],
  }

  const handleLogin = (userData: {
    id: string
    email: string
    name: string
    isSubscribed: boolean
    profile?: UserProfile
    joinDate: string
  }) => {
    setUser(userData)
    localStorage.setItem("learnmate_user", JSON.stringify(userData))
    if (userData.profile) {
      setUserProfile(userData.profile)
    }
    setCurrentView("main")
  }

  const handleSignup = (
    userData: {
      id: string
      email: string
      name: string
      isSubscribed: boolean
      profile?: UserProfile
      joinDate: string
    },
    profile: UserProfile,
  ) => {
    const newUser = { ...userData, profile }
    setUser(newUser)
    setUserProfile(profile)
    localStorage.setItem("learnmate_user", JSON.stringify(newUser))

    // Auto-generate recommendations after signup
    setShowRecommendations(true)

    setCurrentView("main")

    // Scroll to recommendations after a short delay
    setTimeout(() => {
      document.getElementById("recommendations")?.scrollIntoView({ behavior: "smooth" })
    }, 500)
  }

  const handleLogout = () => {
    setUser(null)
    setUserProfile({
      name: "",
      age: "",
      interests: [],
      skillLevels: {},
      goal: "",
    })
    localStorage.removeItem("learnmate_user")
    setCurrentView("main")
    setShowRecommendations(false)
    setIsAdminMode(false)
  }

  // 관리자 모드 활성화 함수
  const enableAdminMode = () => {
    const adminUser = {
      id: "admin",
      email: "admin@learnmate.com",
      name: "홍길동",
      isSubscribed: true,
      profile: {
        name: "홍길동",
        age: "20대",
        interests: ["design"],
        skillLevels: { design: "초급" },
        goal: "디자인 기초를 배우고 싶습니다",
      },
      joinDate: new Date().toISOString(),
    }

    setUser(adminUser)
    setUserProfile(adminUser.profile)
    setIsAdminMode(true)
    setShowRecommendations(true)

    // Scroll to recommendations after a short delay
    setTimeout(() => {
      document.getElementById("recommendations")?.scrollIntoView({ behavior: "smooth" })
    }, 500)
  }

  const getRecommendedVideos = () => {
    const recommended: Video[] = []
    userProfile.interests.forEach((interest) => {
      const videos = videoDatabase[interest as keyof typeof videoDatabase] || []
      recommended.push(...videos)
    })
    return recommended
  }

  // 썸네일 이미지 경로를 반환하는 함수 수정
  const getThumbnailImage = (video: Video, isSubscribed: boolean) => {
    if (!isSubscribed) {
      return null // 구독하지 않은 경우 기본 이모지 사용
    }

    switch (video.title) {
      case "Photoshop 기초강좌":
        return "https://i.ytimg.com/vi/hz0OHaPpjWA/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCRTg5mPvYkcEUDHm5P2ycTt7U75A"
      case "브랜딩 디자인":
        return "/images/branding-thumbnail.avif"
      case "UI/UX 디자인 입문":
        return "https://i.ytimg.com/vi/AwgbMaxb59c/maxresdefault.jpg"
      default:
        return null
    }
  }

  const getLevelColor = (level: string) => {
    const colors = {
      초급: "bg-green-100 text-green-700",
      중급: "bg-yellow-100 text-yellow-700",
      상급: "bg-red-100 text-red-700",
    }
    return colors[level as keyof typeof colors] || "bg-gray-100 text-gray-700"
  }

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

  const openVideoPlayer = (video: Video) => {
    setSelectedVideo(video)
    setCurrentView("video")
    window.scrollTo(0, 0)
  }

  // Render different views
  if (currentView === "login") {
    return (
      <LoginPage onLogin={handleLogin} onSwitchToSignup={() => setCurrentView("signup")} language={currentLanguage} />
    )
  }

  if (currentView === "signup") {
    return (
      <SignupPage onSignup={handleSignup} onSwitchToLogin={() => setCurrentView("login")} language={currentLanguage} />
    )
  }

  if (currentView === "mypage") {
    return <MyPage user={user!} onBack={() => setCurrentView("main")} language={currentLanguage} />
  }

  if (currentView === "subscription") {
    return (
      <SubscriptionPage
        user={user}
        onSubscribe={(updatedUser) => {
          setUser(updatedUser)
          localStorage.setItem("learnmate_user", JSON.stringify(updatedUser))
          setCurrentView("main")
        }}
        onBack={() => setCurrentView("main")}
        language={currentLanguage}
      />
    )
  }

  if (currentView === "courses") {
    return (
      <CoursesPage
        user={user}
        onBack={() => setCurrentView("main")}
        onVideoSelect={openVideoPlayer}
        language={currentLanguage}
      />
    )
  }

  if (currentView === "video" && selectedVideo && (user?.isSubscribed || isAdminMode)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img src="/images/pocket-teacher-logo.png" alt="포켓쌤" className="w-8 h-8" />
              <span className="text-xl font-bold text-gray-800">{t("service-name")}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <Button
                  variant={currentLanguage === "ja" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentLanguage("ja")}
                >
                  🇯🇵 日本語
                </Button>
                <Button
                  variant={currentLanguage === "ko" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentLanguage("ko")}
                >
                  🇰🇷 한국어
                </Button>
              </div>
              {user && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{user.name}님</span>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => setCurrentView("main")} className="mb-6 flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>{t("back-button")}</span>
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <VideoPlayer video={selectedVideo} />
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                    {selectedVideo.title}
                    <Badge className={getLevelColor(selectedVideo.level)}>{selectedVideo.level}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{selectedVideo.description}</p>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <AIChat video={selectedVideo} userProfile={userProfile} language={currentLanguage} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/images/pocket-teacher-logo.png" alt="포켓쌤" className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-800">{t("service-name")}</span>
            {isAdminMode && <Badge className="bg-red-100 text-red-700 text-xs">관리자 모드</Badge>}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <Button
                variant={currentLanguage === "ja" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentLanguage("ja")}
              >
                🇯🇵 日本語
              </Button>
              <Button
                variant={currentLanguage === "ko" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentLanguage("ko")}
              >
                🇰🇷 한국어
              </Button>
            </div>
            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => setCurrentView("courses")}
                className="text-gray-600 hover:text-gray-800 transition"
              >
                {t("nav-courses")}
              </button>
              {user ? (
                <>
                  <button
                    onClick={() => setCurrentView("mypage")}
                    className="text-gray-600 hover:text-gray-800 transition flex items-center space-x-1"
                  >
                    <User className="w-4 h-4" />
                    <span>{t("nav-mypage")}</span>
                  </button>
                  <button onClick={handleLogout} className="text-gray-600 hover:text-gray-800 transition">
                    {t("nav-logout")}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setCurrentView("login")}
                    className="text-gray-600 hover:text-gray-800 transition"
                  >
                    {t("nav-login")}
                  </button>
                  <button
                    onClick={() => setCurrentView("signup")}
                    className="text-gray-600 hover:text-gray-800 transition"
                  >
                    {t("nav-signup")}
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-400 via-purple-400 to-blue-400 py-20 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{t("hero-title")}</h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">{t("hero-subtitle")}</p>
          <Button
            size="lg"
            className="bg-white text-gray-800 hover:bg-gray-50"
            onClick={() => setCurrentView("signup")}
          >
            {t("hero-button")} 🎨
          </Button>
        </div>

        {/* Admin Mode Button */}
        <div className="absolute bottom-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={enableAdminMode}
            className="text-white/70 hover:text-white hover:bg-white/10 p-2"
            title="관리자 모드"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Learning Journey */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t("roadmap-title")}</h2>
          <Card className="p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="font-semibold mb-2">{t("roadmap-start")}</h3>
                <p className="text-sm text-gray-600">{t("roadmap-start-desc")}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌿</span>
                </div>
                <h3 className="font-semibold mb-2">{t("roadmap-growth")}</h3>
                <p className="text-sm text-gray-600">{t("roadmap-growth-desc")}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌳</span>
                </div>
                <h3 className="font-semibold mb-2">{t("roadmap-master")}</h3>
                <p className="text-sm text-gray-600">{t("roadmap-master-desc")}</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Recommended Content */}
      {showRecommendations && (
        <section id="recommendations" className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            {user && (
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  {isAdminMode ? "관리자 모드 활성화!" : t("welcome-back")} {user.name}님!
                </h2>
                <p className="text-lg text-gray-600">
                  {isAdminMode ? "모든 기능을 자유롭게 테스트해보세요" : t("recommendations-ready")}
                </p>
              </div>
            )}
            <h2 className="text-3xl font-bold text-center mb-4">{t("recommendations-title")}</h2>
            {!isAdminMode && <p className="text-center text-gray-600 mb-12">{t("free-trial-limit")}</p>}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getRecommendedVideos().map((video, index) => {
                const thumbnailImage = getThumbnailImage(video, user?.isSubscribed || isAdminMode || false)

                return (
                  <Card
                    key={index}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative"
                    onClick={() => openVideoPlayer(video)}
                  >
                    <div className="h-48 bg-gradient-to-br from-green-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
                      {thumbnailImage ? (
                        <img
                          src={thumbnailImage || "/placeholder.svg"}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-6xl">{getInterestEmoji(video.category)}</div>
                      )}
                      {!user?.isSubscribed && !isAdminMode && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Lock className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getLevelColor(video.level)}>{video.level}</Badge>
                        <span className="text-xs text-gray-500">{t(`interest-${video.category}`)}</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{video.description}</p>
                      <div className="text-sm text-green-600 font-medium flex items-center">
                        {user?.isSubscribed || isAdminMode ? (
                          <>
                            <Play className="w-4 h-4 mr-1" />
                            {t("click-to-watch")}
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-1" />
                            {t("subscription-required-short")}
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            {!user?.isSubscribed && !isAdminMode && (
              <div className="text-center mt-8">
                <Button
                  onClick={() => setCurrentView("subscription")}
                  size="lg"
                  className="bg-gradient-to-r from-green-400 to-purple-400"
                >
                  {user ? t("upgrade-to-premium") : t("signup-to-save")}
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="/images/pocket-teacher-logo.png" alt="포켓쌤" className="w-8 h-8" />
            <span className="text-xl font-bold">{t("service-name")}</span>
          </div>
          <p className="text-gray-400 mb-6">{t("footer-text")}</p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="#" className="hover:text-green-400 transition">
              {t("footer-terms")}
            </a>
            <a href="#" className="hover:text-green-400 transition">
              {t("footer-privacy")}
            </a>
            <a href="#" className="hover:text-green-400 transition">
              {t("footer-contact")}
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
