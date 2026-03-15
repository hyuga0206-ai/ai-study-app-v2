import Link from "next/link"
import { chapters } from "@/data/chapters"
import { questions } from "@/data/questions"

export default function DashboardPage() {
  const totalTopics = chapters.reduce((acc, ch) => acc + ch.topics.length, 0)

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">ダッシュボード</h1>
      <p className="text-gray-500 mb-8 text-sm">金融機関における生成AIガイドライン（第1.1版）</p>

      {/* サマリーカード */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">学習トピック数</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">
            {totalTopics}
          </p>
          <p className="text-sm text-gray-400 mt-1">全{chapters.length}章</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">演習問題数</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{questions.length}</p>
          <p className="text-sm text-gray-400 mt-1">全章合計</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">対象ガイドライン</p>
          <p className="text-lg font-bold text-violet-600 mt-1">FDUA v1.1</p>
          <p className="text-sm text-gray-400 mt-1">2025年7月14日版</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 章一覧 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">章で学習</h2>
            <Link href="/chapters" className="text-sm text-blue-600 hover:underline">
              すべて見る →
            </Link>
          </div>
          <ul className="space-y-1">
            {chapters.map((ch) => (
              <li key={ch.id}>
                <Link
                  href={`/chapters/${ch.id}`}
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded text-xs font-bold flex items-center justify-center mt-0.5">
                    {ch.id}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                      {ch.title}
                    </p>
                    <p className="text-xs text-gray-400">{ch.topics.length}トピック</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* クイックアクション */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">クイックスタート</h2>
            <div className="space-y-3">
              <Link
                href="/quiz"
                className="flex items-center gap-3 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-3 text-sm font-medium transition-colors"
              >
                <span>✏️</span>
                <span>問題を解く</span>
              </Link>
              <Link
                href="/chapters"
                className="flex items-center gap-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-3 text-sm font-medium transition-colors"
              >
                <span>📚</span>
                <span>テキストを読む</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
