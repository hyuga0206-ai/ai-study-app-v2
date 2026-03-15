import Link from "next/link"
import { chapters } from "@/data/chapters"
import { questions } from "@/data/questions"

export default function QuizTopPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">問題演習</h1>
      <p className="text-gray-500 mb-8 text-sm">章を選んで演習を始めましょう</p>

      <div className="space-y-3">
        {/* 全章 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">全章横断</h2>
              <p className="text-sm text-gray-500 mt-0.5">全{questions.length}問からランダム出題</p>
            </div>
            <Link
              href="/quiz/session?chapter=0"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              開始 →
            </Link>
          </div>
        </div>

        {/* 章別 */}
        {chapters.map((ch) => {
          const qCount = questions.filter((q) => q.chapterId === ch.id).length
          return (
            <div
              key={ch.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-sm">
                    {ch.id}
                  </div>
                  <div>
                    <h2 className="font-medium text-gray-900 text-sm">{ch.title}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">{qCount}問</p>
                  </div>
                </div>
                {qCount > 0 ? (
                  <Link
                    href={`/quiz/session?chapter=${ch.id}`}
                    className="px-4 py-1.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    開始 →
                  </Link>
                ) : (
                  <span className="text-xs text-gray-300">準備中</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
