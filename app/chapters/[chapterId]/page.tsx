import Link from "next/link"
import { notFound } from "next/navigation"
import { chapters, getChapter } from "@/data/chapters"
import { questions } from "@/data/questions"

export function generateStaticParams() {
  return chapters.map((ch) => ({ chapterId: String(ch.id) }))
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>
}) {
  const { chapterId } = await params
  const chapter = getChapter(Number(chapterId))
  if (!chapter) notFound()

  const chapterQuestions = questions.filter((q) => q.chapterId === chapter.id)

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/chapters" className="text-sm text-gray-500 hover:text-gray-700">
          ← 章一覧
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">
          {chapter.id}
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium">第{chapter.id}章</p>
          <h1 className="text-2xl font-bold text-gray-900">{chapter.title}</h1>
        </div>
      </div>
      <p className="text-gray-600 mb-4 leading-relaxed">{chapter.summary}</p>

      <div className="flex flex-wrap gap-1.5 mb-8">
        {chapter.keywords.map((kw) => (
          <span key={kw} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
            {kw}
          </span>
        ))}
      </div>

      {/* トピック一覧 */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">トピック</h2>
      <div className="space-y-3 mb-8">
        {chapter.topics.map((topic, idx) => (
          <Link
            key={topic.id}
            href={`/chapters/${chapter.id}/${topic.id}`}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gray-100 text-gray-500">
              {idx + 1}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                {topic.title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{topic.keyPoints.length}つのキーポイント · {topic.terms.length}つの用語</p>
            </div>
            <span className="text-gray-300 group-hover:text-blue-400 transition-colors">→</span>
          </Link>
        ))}
      </div>

      {/* この章の演習 */}
      <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900">第{chapter.id}章の演習問題</h3>
            <p className="text-sm text-blue-700 mt-0.5">{chapterQuestions.length}問の確認テスト</p>
          </div>
          <Link
            href={`/quiz?chapter=${chapter.id}`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            演習を開始 →
          </Link>
        </div>
      </div>
    </div>
  )
}
