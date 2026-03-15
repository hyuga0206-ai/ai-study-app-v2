"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { getQuestionsByChapter } from "@/data/questions"
import { chapters } from "@/data/chapters"
import QuizSession from "@/components/QuizSession"
import Link from "next/link"

function QuizSessionContent() {
  const searchParams = useSearchParams()
  const chapter = searchParams.get("chapter")
  const count = searchParams.get("count")
  const chapterId = chapter ? Number(chapter) : 0

  const pool = getQuestionsByChapter(chapterId)

  const [shuffled] = useState(() => {
    const maxCount = Math.min(pool.length, count ? Number(count) : 10)
    return [...pool].sort(() => Math.random() - 0.5).slice(0, maxCount)
  })

  if (pool.length === 0) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <p className="text-gray-600 mb-4">問題が見つかりません</p>
        <Link href="/quiz" className="text-blue-600 hover:underline">演習トップへ</Link>
      </div>
    )
  }

  const chapterName =
    chapterId === 0
      ? "全章横断"
      : `第${chapterId}章：${chapters.find((c) => c.id === chapterId)?.title}`

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <p className="text-sm text-gray-500">{chapterName}</p>
        <h1 className="text-xl font-bold text-gray-900">問題演習</h1>
      </div>
      <QuizSession questions={shuffled} chapterId={chapterId} />
    </div>
  )
}

export default function QuizSessionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-500">読み込み中...</div>}>
      <QuizSessionContent />
    </Suspense>
  )
}
