import type { NextRequest } from "next/server"
import { language } from "@/app/api/chat/utils" // Declare the language variable

export async function POST(req: NextRequest) {
  try {
    const { message, video, userProfile, messages } = await req.json()

    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is not configured")
      return new Response(
        JSON.stringify({
          message:
            language === "ja"
              ? "申し訳ございません。AIサービスが現在利用できません。"
              : "죄송합니다. AI 서비스를 현재 이용할 수 없습니다.",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Build conversation messages for OpenAI API
    const conversationMessages = [
      {
        role: "system",
        content:
          language === "ja"
            ? `あなたは親切で知識豊富な学習アシスタントです。現在、ユーザーは「${video.title}」という${video.level}レベルの${video.category}分野の動画を視聴しています。

動画の説明: ${video.description}

ユーザーのプロフィール:
- 名前: ${userProfile.name}
- 年齢: ${userProfile.age}
- 興味分野: ${userProfile.interests.join(", ")}
- 学習目標: ${userProfile.goal}

ユーザーの質問に対して、動画の内容や学習に関連した親切で分かりやすい回答を日本語で提供してください。専門用語を使う場合は簡単に説明も加えてください。回答は500文字 이내로 간결하게 해주세요。`
            : `당신은 친절하고 지식이 풍부한 학습 도우미입니다. 현재 사용자는 "${video.title}"라는 ${video.level} 레벨의 ${video.category} 분야 영상을 시청하고 있습니다.

영상 설명: ${video.description}

사용자 프로필:
- 이름: ${userProfile.name}
- 나이: ${userProfile.age}
- 관심 분야: ${userProfile.interests.join(", ")}
- 학습 목표: ${userProfile.goal}

사용자의 질문에 대해 영상 내용이나 학습과 관련된 친절하고 이해하기 쉬운 답변을 한국어로 제공해주세요. 전문 용어를 사용할 때는 간단한 설명도 함께 해주세요. 답변은 500자 이내로 간결하게 해주세요.`,
      },
      // Add previous messages for context (last 5 messages)
      ...messages.slice(-5).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: "user",
        content: message,
      },
    ]

    // Call OpenAI API directly
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: conversationMessages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiMessage = data.choices[0]?.message?.content || "응답을 생성할 수 없습니다."

    return new Response(
      JSON.stringify({
        message: aiMessage,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("Chat API error:", error)

    return new Response(
      JSON.stringify({
        message:
          language === "ja"
            ? "申し訳ございません。一時的なエラーが発生しました。しばらく後でもう一度お試しください。"
            : "죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
