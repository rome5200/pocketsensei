import { Card } from "@/components/ui/card"
import { Play, Clock, BookOpen } from "lucide-react"

interface Video {
  title: string
  level: string
  description: string
  category: string
  youtubeId?: string
}

interface VideoPlayerProps {
  video: Video
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  // 각 영상별 YouTube ID 매핑
  const getYouTubeId = (title: string) => {
    switch (title) {
      case "Photoshop 기초강좌":
        return "hz0OHaPpjWA"
      case "UI/UX 디자인 입문":
        return "AwgbMaxb59c"
      case "브랜딩 디자인":
        return "u_cYfz6vgTY"
      default:
        return null
    }
  }

  const youtubeId = getYouTubeId(video.title)
  const isUIUXCourse = video.title === "UI/UX 디자인 입문"

  const chapters = [
    { title: "피그마 소개 및 기본 인터페이스", time: "00:00", duration: "5분" },
    { title: "새 프로젝트 생성하기", time: "05:00", duration: "3분" },
    { title: "기본 도형 그리기", time: "08:00", duration: "7분" },
    { title: "텍스트 도구 사용법", time: "15:00", duration: "4분" },
    { title: "레이어 관리하기", time: "19:00", duration: "6분" },
    { title: "색상과 그라데이션", time: "25:00", duration: "5분" },
    { title: "컴포넌트 만들기", time: "30:00", duration: "8분" },
    { title: "오토 레이아웃 기초", time: "38:00", duration: "10분" },
    { title: "프로토타이핑 기본", time: "48:00", duration: "7분" },
    { title: "파일 공유 및 협업", time: "55:00", duration: "5분" },
  ]

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        {youtubeId ? (
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="rounded-lg"
            />
          </div>
        ) : (
          <div className="aspect-video bg-black flex items-center justify-center relative">
            <div className="text-center text-white">
              <Play className="w-16 h-16 mb-4 mx-auto" />
              <div className="text-lg">동영상 재생 중...</div>
              <div className="text-sm opacity-75 mt-2">{video.title}</div>
            </div>
          </div>
        )}
      </Card>

      {/* Table of Contents - only show for UI/UX course */}
      {isUIUXCourse && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold">강의 목차</h3>
            <span className="text-sm text-gray-500">총 {chapters.length}개 챕터</span>
          </div>

          <div className="space-y-3">
            {chapters.map((chapter, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 group-hover:text-purple-600 transition-colors">
                      {chapter.title}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{chapter.time}</span>
                      <span>•</span>
                      <span>{chapter.duration}</span>
                    </div>
                  </div>
                </div>
                <Play className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">학습 진행률</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                style={{ width: "0%" }}
              ></div>
            </div>
            <p className="text-xs text-gray-600">0/10 챕터 완료 • 예상 학습 시간: 60분</p>
          </div>
        </Card>
      )}
    </div>
  )
}
