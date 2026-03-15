import { notFound } from "next/navigation"
import Link from "next/link"
import { chapters, getChapter, getTopic } from "@/data/chapters"
import { questions } from "@/data/questions"
import TopicContent from "@/components/TopicContent"

export function generateStaticParams() {
  return chapters.flatMap((ch) =>
    ch.topics.map((t) => ({ chapterId: String(ch.id), topicId: t.id }))
  )
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ chapterId: string; topicId: string }>
}) {
  const { chapterId, topicId } = await params
  const chapter = getChapter(Number(chapterId))
  const topic = getTopic(topicId)
  if (!chapter || !topic) notFound()

  const topicIndex = chapter.topics.findIndex((t) => t.id === topicId)
  const prevTopic = chapter.topics[topicIndex - 1]
  const nextTopic = chapter.topics[topicIndex + 1]

  // このトピックに関連する問題（最大2問）
  const related = questions.filter((q) => q.topicId === topicId).slice(0, 2)
  const fallback = related.length < 2
    ? questions
        .filter((q) => q.chapterId === topic.chapterId && q.topicId !== topicId)
        .slice(0, 2 - related.length)
    : []
  const relatedQuestions = [...related, ...fallback]

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* パンくず */}
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-500 flex-wrap">
        <Link href="/chapters" className="hover:text-gray-700">章一覧</Link>
        <span>›</span>
        <Link href={`/chapters/${chapter.id}`} className="hover:text-gray-700">第{chapter.id}章</Link>
        <span>›</span>
        <span className="text-gray-900 font-medium">{topic.title}</span>
      </div>

      <TopicContent
        topic={topic}
        chapter={chapter}
        relatedQuestions={relatedQuestions}
      />

      {/* 前後ナビ */}
      <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
        {prevTopic ? (
          <Link
            href={`/chapters/${chapter.id}/${prevTopic.id}`}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>{prevTopic.title}</span>
          </Link>
        ) : (
          <div />
        )}
        {nextTopic ? (
          <Link
            href={`/chapters/${chapter.id}/${nextTopic.id}`}
            className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors group"
          >
            <span>次へ：{nextTopic.title}</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        ) : (
          <Link
            href={`/chapters/${chapter.id}`}
            className="flex items-center gap-2 text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <span>章のまとめへ</span>
            <span>→</span>
          </Link>
        )}
      </div>
    </div>
  )
}
