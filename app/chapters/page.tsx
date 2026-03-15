import Link from "next/link"
import { chapters } from "@/data/chapters"
import { questions } from "@/data/questions"

export default function ChaptersPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">章で学習</h1>
      <p className="text-gray-500 mb-8 text-sm">全8章 · 各章のトピックを読んで理解を深めましょう</p>

      <div className="space-y-4">
        {chapters.map((ch) => {
          const qCount = questions.filter((q) => q.chapterId === ch.id).length

          return (
            <div key={ch.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                      {ch.id}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">第{ch.id}章 {ch.title}</h2>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">{ch.summary}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {ch.keywords.slice(0, 5).map((kw) => (
                          <span
                            key={kw}
                            className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm text-gray-400">{ch.topics.length}トピック</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <p className="text-xs text-gray-400">{qCount}問の演習問題あり</p>
                  <div className="flex gap-2">
                    <Link
                      href={`/quiz?chapter=${ch.id}`}
                      className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      演習を解く
                    </Link>
                    <Link
                      href={`/chapters/${ch.id}`}
                      className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                    >
                      学習する →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
