"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Play, Lock, Grid, List } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { translations, type Language } from "@/lib/translations"

interface Video {
  title: string
  level: string
  description: string
  category: string
  duration?: string
  instructor?: string
  rating?: number
  students?: number
}

interface User {
  id: string
  email: string
  name: string
  isSubscribed: boolean
  profile?: any
  joinDate: string
}

interface CoursesPageProps {
  user: User | null
  onBack: () => void
  onVideoSelect: (video: Video) => void
  language: Language
}

export function CoursesPage({ user, onBack, onVideoSelect, language }: CoursesPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("title")

  const t = (key: string) => translations[language][key] || key

  // 전체 강좌 데이터
  const allVideos: Video[] = [
    // Design
    {
      title: "Photoshop 기초강좌",
      level: "초급",
      description: "디자인의 기본 도구를 배우자",
      category: "design",
      duration: "2시간 30분",
      instructor: "김디자인",
      rating: 4.8,
      students: 1250,
    },
    {
      title: "UI/UX 디자인 입문",
      level: "중급",
      description: "피그마로 시작하는 UI/UX 디자인 기초",
      category: "design",
      duration: "3시간 15분",
      instructor: "박UX",
      rating: 4.9,
      students: 890,
    },
    {
      title: "브랜딩 디자인",
      level: "상급",
      description: "프로급 브랜드 구축",
      category: "design",
      duration: "4시간 20분",
      instructor: "이브랜드",
      rating: 4.7,
      students: 650,
    },
    {
      title: "일러스트레이터 마스터",
      level: "중급",
      description: "벡터 그래픽 디자인의 모든 것",
      category: "design",
      duration: "3시간 45분",
      instructor: "최일러스트",
      rating: 4.6,
      students: 720,
    },
    // Programming
    {
      title: "HTML/CSS 기초",
      level: "초급",
      description: "Web 페이지 작성의 첫걸음",
      category: "programming",
      duration: "2시간 15분",
      instructor: "정웹개발",
      rating: 4.5,
      students: 2100,
    },
    {
      title: "JavaScript 실천",
      level: "중급",
      description: "동적인 웹사이트를 만들자",
      category: "programming",
      duration: "4시간 30분",
      instructor: "김자바스크립트",
      rating: 4.8,
      students: 1800,
    },
    {
      title: "React 개발 마스터",
      level: "상급",
      description: "모던한 웹 앱 개발",
      category: "programming",
      duration: "6시간 20분",
      instructor: "박리액트",
      rating: 4.9,
      students: 1350,
    },
    {
      title: "Python 데이터 분석",
      level: "중급",
      description: "파이썬으로 데이터를 분석해보자",
      category: "programming",
      duration: "5시간 10분",
      instructor: "이파이썬",
      rating: 4.7,
      students: 980,
    },
    // Cooking
    {
      title: "기본 일식",
      level: "초급",
      description: "집밥의 기초를 배우자",
      category: "cooking",
      duration: "1시간 45분",
      instructor: "요리왕",
      rating: 4.4,
      students: 560,
    },
    {
      title: "이탈리안 요리",
      level: "중급",
      description: "본격적인 파스타와 피자",
      category: "cooking",
      duration: "2시간 30분",
      instructor: "마리오셰프",
      rating: 4.6,
      students: 420,
    },
    {
      title: "프렌치 기법",
      level: "상급",
      description: "전문 조리 기술을 마스터",
      category: "cooking",
      duration: "3시간 50분",
      instructor: "피에르셰프",
      rating: 4.8,
      students: 280,
    },
    // Music
    {
      title: "피아노 입문",
      level: "초급",
      description: "악보 읽는 법부터 시작",
      category: "music",
      duration: "2시간 20분",
      instructor: "음악선생",
      rating: 4.5,
      students: 890,
    },
    {
      title: "기타 연주",
      level: "중급",
      description: "좋아하는 곡을 연주하고 노래",
      category: "music",
      duration: "3시간 15분",
      instructor: "기타리스트",
      rating: 4.7,
      students: 650,
    },
    {
      title: "작곡·편곡 강좌",
      level: "상급",
      description: "오리지널 악곡을 만들자",
      category: "music",
      duration: "4시간 40분",
      instructor: "작곡가",
      rating: 4.9,
      students: 320,
    },
    // Language
    {
      title: "영어회화 기초",
      level: "초급",
      description: "일상회화부터 시작하자",
      category: "language",
      duration: "2시간 10분",
      instructor: "영어선생",
      rating: 4.6,
      students: 1500,
    },
    {
      title: "비즈니스 영어",
      level: "중급",
      description: "일에서 쓸 수 있는 영어실력",
      category: "language",
      duration: "3시간 30분",
      instructor: "비즈니스코치",
      rating: 4.8,
      students: 780,
    },
    {
      title: "영어 프레젠테이션 기술",
      level: "상급",
      description: "설득력 있는 발표 스킬",
      category: "language",
      duration: "2시간 45분",
      instructor: "프레젠터",
      rating: 4.7,
      students: 450,
    },
    // Business
    {
      title: "마케팅 기초",
      level: "초급",
      description: "고객심리를 이해하자",
      category: "business",
      duration: "2시간 25분",
      instructor: "마케터",
      rating: 4.5,
      students: 920,
    },
    {
      title: "데이터 분석 입문",
      level: "중급",
      description: "Excel로 시작하는 데이터 활용",
      category: "business",
      duration: "3시간 20분",
      instructor: "데이터분석가",
      rating: 4.7,
      students: 680,
    },
    {
      title: "경영전략론",
      level: "상급",
      description: "사업성장을 위한 전략사고",
      category: "business",
      duration: "4시간 15분",
      instructor: "경영컨설턴트",
      rating: 4.8,
      students: 380,
    },
  ]

  const categories = [
    { value: "all", label: "전체", emoji: "📚" },
    { value: "design", label: t("interest-design"), emoji: "🎨" },
    { value: "programming", label: t("interest-programming"), emoji: "💻" },
    { value: "cooking", label: t("interest-cooking"), emoji: "🍳" },
    { value: "music", label: t("interest-music"), emoji: "🎵" },
    { value: "language", label: t("interest-language"), emoji: "🌍" },
    { value: "business", label: t("interest-business"), emoji: "📊" },
  ]

  const levels = [
    { value: "all", label: "전체 레벨" },
    { value: "초급", label: "초급" },
    { value: "중급", label: "중급" },
    { value: "상급", label: "상급" },
  ]

  // 필터링된 강좌 목록
  const filteredVideos = useMemo(() => {
    let filtered = allVideos

    // 검색어 필터
    if (searchQuery) {
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.instructor?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // 카테고리 필터
    if (selectedCategory !== "all") {
      filtered = filtered.filter((video) => video.category === selectedCategory)
    }

    // 레벨 필터
    if (selectedLevel !== "all") {
      filtered = filtered.filter((video) => video.level === selectedLevel)
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "students":
          return (b.students || 0) - (a.students || 0)
        case "level":
          const levelOrder = { 초급: 1, 중급: 2, 상급: 3 }
          return levelOrder[a.level as keyof typeof levelOrder] - levelOrder[b.level as keyof typeof levelOrder]
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, selectedCategory, selectedLevel, sortBy])

  const getThumbnailImage = (video: Video) => {
    if (!user?.isSubscribed) {
      return null
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

  const getInterestEmoji = (category: string) => {
    const emojis = {
      design: "🎨",
      programming: "💻",
      cooking: "🍳",
      music: "🎵",
      language: "🌍",
      business: "📊",
    }
    return emojis[category as keyof typeof emojis] || "📚"
  }

  const handleVideoClick = (video: Video) => {
    if (!user) {
      alert(t("login-required"))
      return
    }

    if (!user.isSubscribed) {
      alert(t("subscription-required"))
      return
    }

    onVideoSelect(video)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>{t("back-button")}</span>
            </Button>
            <div className="flex items-center space-x-2">
              <img src="/images/pocket-teacher-logo.png" alt="포켓쌤" className="w-8 h-8" />
              <span className="text-xl font-bold text-gray-800">{t("service-name")}</span>
            </div>
          </div>
          {user && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{user.name}님</span>
              {user.isSubscribed && <Badge className="bg-yellow-100 text-yellow-700">프리미엄</Badge>}
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">전체 강좌</h1>
          <p className="text-gray-600">다양한 분야의 강좌를 탐색해보세요</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="강좌명, 설명, 강사명으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.emoji} {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Level Filter */}
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="레벨" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="정렬" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">제목순</SelectItem>
                <SelectItem value="rating">평점순</SelectItem>
                <SelectItem value="students">수강생순</SelectItem>
                <SelectItem value="level">레벨순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              총 {filteredVideos.length}개의 강좌
              {selectedCategory !== "all" && (
                <span className="ml-2">
                  • {categories.find((c) => c.value === selectedCategory)?.emoji}{" "}
                  {categories.find((c) => c.value === selectedCategory)?.label}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Course Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video, index) => {
              const thumbnailImage = getThumbnailImage(video)
              return (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative group"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="h-48 bg-gradient-to-br from-green-100 to-purple-100 flex items-center justify-center relative overflow-hidden rounded-t-lg">
                    {thumbnailImage ? (
                      <img
                        src={thumbnailImage || "/placeholder.svg"}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-6xl">{getInterestEmoji(video.category)}</div>
                    )}
                    {!user?.isSubscribed && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getLevelColor(video.level)}>{video.level}</Badge>
                      <div className="flex items-center text-xs text-gray-500">⭐ {video.rating}</div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{video.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{video.instructor}</span>
                      <span>{video.students?.toLocaleString()}명</span>
                    </div>
                    <div className="mt-3 text-sm text-green-600 font-medium flex items-center">
                      {user?.isSubscribed ? (
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
        ) : (
          <div className="space-y-4">
            {filteredVideos.map((video, index) => {
              const thumbnailImage = getThumbnailImage(video)
              return (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 relative group"
                  onClick={() => handleVideoClick(video)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-32 h-20 bg-gradient-to-br from-green-100 to-purple-100 flex items-center justify-center relative overflow-hidden rounded-lg flex-shrink-0">
                        {thumbnailImage ? (
                          <img
                            src={thumbnailImage || "/placeholder.svg"}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-3xl">{getInterestEmoji(video.category)}</div>
                        )}
                        {!user?.isSubscribed && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Lock className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-xl">{video.title}</h3>
                            <Badge className={getLevelColor(video.level)}>{video.level}</Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>⭐ {video.rating}</span>
                            <span>{video.students?.toLocaleString()}명</span>
                            <span>{video.duration}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">{video.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">강사: {video.instructor}</span>
                          <div className="text-sm text-green-600 font-medium flex items-center">
                            {user?.isSubscribed ? (
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
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* No Results */}
        {filteredVideos.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-600 mb-4">다른 검색어나 필터를 시도해보세요</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedLevel("all")
              }}
              variant="outline"
            >
              필터 초기화
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
