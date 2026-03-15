import { chapters } from "@/data/chapters"
import { questions } from "@/data/questions"
import Link from "next/link"

export default function ProgressPage() {
  const totalTopics = chapters.reduce((acc, ch) => acc + ch.topics.length, 0)

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">進捗</h1>
      <p className="text-gray-500 mb-8 text-sm">学習コンテンツの概要</p>

      {/* 全体サマリー */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">総トピック数</p>
          <p className="text-2xl font-bold mt-1 text-blue-600">{totalTopics}</p>
          <p className="text-xs text-gray-400 mt-0.5">全{chapters.length}章</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">総演習問題数</p>
          <p className="text-2xl font-bold mt-1 text-gray-900">{questions.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">全章合計</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">対象ガイドライン</p>
          <p className="text-lg font-bold mt-1 text-violet-600">FDUA v1.1</p>
          <p className="text-xs text-gray-400 mt-0.5">2025年7月14日版</p>
        </div>
      </div>

      {/* 章別一覧 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">章別の内容</h2>
        <div className="space-y-4">
          {chapters.map((chapter) => {
            const chapterQuestions = questions.filter((q) => q.chapterId === chapter.id).length
            return (
              <div key={chapter.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded text-xs font-bold flex items-center justify-center">
                      {chapter.id}
                    </span>
                    <span className="text-sm font-medium text-gray-800">{chapter.title}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{chapter.topics.length}トピック · {chapterQuestions}問</span>
                    <Link
                      href={`/chapters/${chapter.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      学習する →
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
