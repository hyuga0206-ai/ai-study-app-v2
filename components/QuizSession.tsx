"use client"

import { useState } from "react"
import Link from "next/link"
import { Question } from "@/types"

type AnswerRecord = {
  questionId: string
  selectedIdx: number
  isCorrect: boolean
}

export default function QuizSession({
  questions,
  chapterId,
}: {
  questions: Question[]
  chapterId: number
}) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])
  const [finished, setFinished] = useState(false)

  const current = questions[currentIdx]
  const isLastQuestion = currentIdx === questions.length - 1

  function handleSelect(idx: number) {
    if (isAnswered) return
    setSelectedIdx(idx)
    setIsAnswered(true)
    const isCorrect = idx === current.correctIdx
    setAnswers((prev) => [...prev, { questionId: current.id, selectedIdx: idx, isCorrect }])
  }

  function handleNext() {
    if (isLastQuestion) {
      setFinished(true)
      return
    }
    setCurrentIdx((prev) => prev + 1)
    setSelectedIdx(null)
    setIsAnswered(false)
  }

  if (finished) {
    const correctCount = answers.filter((a) => a.isCorrect).length
    const rate = Math.round((correctCount / questions.length) * 100)
    const wrongAnswers = answers.filter((a) => !a.isCorrect)

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
          <p className="text-5xl font-bold text-blue-600 mb-2">{rate}%</p>
          <p className="text-lg font-semibold text-gray-900">{correctCount} / {questions.length} 正解</p>
          <p className="text-sm text-gray-500 mt-1">
            {rate >= 80 ? "素晴らしい！" : rate >= 60 ? "もう少しです！" : "復習しましょう"}
          </p>
        </div>

        {wrongAnswers.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">間違えた問題</h2>
            <ul className="space-y-4">
              {wrongAnswers.map((a) => {
                const q = questions.find((q) => q.id === a.questionId)
                if (!q) return null
                return (
                  <li key={a.questionId} className="border-l-4 border-red-400 pl-4">
                    <p className="text-sm font-medium text-gray-900">{q.text}</p>
                    <p className="text-xs text-red-600 mt-1">あなたの回答: {q.options[a.selectedIdx]}</p>
                    <p className="text-xs text-emerald-600 mt-0.5">正解: {q.options[q.correctIdx]}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{q.explanation}</p>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        <div className="flex gap-3">
          <Link
            href="/quiz"
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-sm font-medium text-center transition-colors"
          >
            演習トップへ
          </Link>
          <Link
            href="/quiz"
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium text-center transition-colors"
          >
            もう一度挑戦
          </Link>
        </div>
      </div>
    )
  }

  const progress = ((currentIdx + (isAnswered ? 1 : 0)) / questions.length) * 100

  return (
    <div className="space-y-4">
      {/* 進捗 */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 rounded-full">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm text-gray-500 flex-shrink-0">
          {currentIdx + 1} / {questions.length}
        </span>
      </div>

      {/* 問題カード */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              current.difficulty === "basic" ? "bg-green-100 text-green-700" :
              current.difficulty === "intermediate" ? "bg-yellow-100 text-yellow-700" :
              "bg-red-100 text-red-700"
            }`}>
              {current.difficulty === "basic" ? "基礎" : current.difficulty === "intermediate" ? "応用" : "発展"}
            </span>
            <span className="text-xs text-gray-400">第{current.chapterId}章</span>
          </div>

          <p className="text-base font-medium text-gray-900 leading-relaxed mb-6">
            {current.text}
          </p>

          <div className="space-y-2">
            {current.options.map((option, idx) => {
              let className = "w-full text-left px-4 py-3 rounded-lg border text-sm transition-all "
              if (!isAnswered) {
                className += "border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700"
              } else if (idx === current.correctIdx) {
                className += "border-emerald-400 bg-emerald-50 text-emerald-800 font-medium"
              } else if (idx === selectedIdx) {
                className += "border-red-400 bg-red-50 text-red-800"
              } else {
                className += "border-gray-100 text-gray-400"
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={className}
                  disabled={isAnswered}
                >
                  <span className="font-medium mr-2">
                    {["A", "B", "C", "D"][idx]}.
                  </span>
                  {option}
                </button>
              )
            })}
          </div>
        </div>

        {/* 解説 */}
        {isAnswered && (
          <div className={`border-t p-5 ${
            selectedIdx === current.correctIdx ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"
          }`}>
            <p className={`text-sm font-bold mb-2 ${
              selectedIdx === current.correctIdx ? "text-emerald-700" : "text-red-700"
            }`}>
              {selectedIdx === current.correctIdx ? "✓ 正解！" : "✗ 不正解"}
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{current.explanation}</p>

            <button
              onClick={handleNext}
              className="mt-4 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {isLastQuestion ? "結果を見る" : "次の問題へ →"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
