"use client"

import { useState } from "react"
import { Topic, Chapter, Question } from "@/types"

// ===== フラッシュカード =====
function FlashCard({ word, definition }: { word: string; definition: string }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <button
      onClick={() => setFlipped(!flipped)}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        flipped
          ? "border-blue-400 bg-blue-50"
          : "border-slate-200 bg-white hover:border-blue-300"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-900">{word}</p>
          {flipped && (
            <p className="text-sm text-blue-800 mt-2 leading-relaxed">{definition}</p>
          )}
        </div>
        <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
          flipped ? "bg-blue-200 text-blue-700" : "bg-slate-100 text-slate-500"
        }`}>
          {flipped ? "非表示" : "定義を見る"}
        </span>
      </div>
    </button>
  )
}

// ===== インラインミニクイズ =====
function MiniQuiz({ question }: { question: Question }) {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="border border-violet-200 rounded-xl overflow-hidden">
      <div className="bg-violet-50 px-4 py-2.5 border-b border-violet-200">
        <p className="text-xs font-bold text-violet-700">確認問題</p>
      </div>
      <div className="p-4">
        <p className="text-sm font-medium text-gray-900 mb-3">{question.text}</p>
        <div className="space-y-2">
          {question.options.map((opt, idx) => {
            let cls = "w-full text-left text-sm px-3 py-2 rounded-lg border transition-all "
            if (selected === null) {
              cls += "border-gray-200 hover:border-violet-400 hover:bg-violet-50 text-gray-700"
            } else if (idx === question.correctIdx) {
              cls += "border-emerald-400 bg-emerald-50 text-emerald-800 font-medium"
            } else if (idx === selected) {
              cls += "border-red-400 bg-red-50 text-red-800"
            } else {
              cls += "border-gray-100 text-gray-400"
            }
            return (
              <button key={idx} onClick={() => setSelected(idx)} disabled={selected !== null} className={cls}>
                <span className="font-medium mr-1.5">{["A", "B", "C", "D"][idx]}.</span>
                {opt}
              </button>
            )
          })}
        </div>
        {selected !== null && (
          <div className={`mt-3 p-3 rounded-lg text-sm ${
            selected === question.correctIdx ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
          }`}>
            <p className="font-bold mb-1">{selected === question.correctIdx ? "✓ 正解！" : "✗ 不正解"}</p>
            <p className="leading-relaxed">{question.explanation}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ===== メインコンポーネント =====
export default function TopicContent({
  topic,
  chapter,
  relatedQuestions = [],
}: {
  topic: Topic
  chapter: Chapter
  relatedQuestions?: Question[]
}) {
  const [isCompleted, setIsCompleted] = useState(false)

  function markComplete() {
    setIsCompleted((prev) => !prev)
  }

  // 目次抽出（## セクション）
  const toc = topic.content
    .split("\n")
    .filter((l) => l.startsWith("## "))
    .map((l) => l.slice(3))

  function renderContent(text: string) {
    const lines = text.split("\n")
    const elements: React.ReactNode[] = []
    let i = 0

    while (i < lines.length) {
      const line = lines[i]

      // コールアウトボックス（> [!TYPE] または > !type で始まる行）
      if (line.match(/^>\s*\[!(IMPORTANT|NOTE|TIP|WARNING)\]/)) {
        const type = line.match(/\[!(\w+)\]/)![1]
        const calloutLines: string[] = []
        i++
        while (i < lines.length && lines[i].startsWith("> ")) {
          calloutLines.push(lines[i].slice(2))
          i++
        }
        const styles: Record<string, { bg: string; border: string; icon: string; label: string; text: string }> = {
          IMPORTANT: { bg: "bg-red-50", border: "border-red-400", icon: "🔴", label: "重要", text: "text-red-900" },
          NOTE: { bg: "bg-blue-50", border: "border-blue-400", icon: "ℹ️", label: "補足", text: "text-blue-900" },
          TIP: { bg: "bg-emerald-50", border: "border-emerald-400", icon: "💡", label: "ポイント", text: "text-emerald-900" },
          WARNING: { bg: "bg-amber-50", border: "border-amber-400", icon: "⚠️", label: "注意", text: "text-amber-900" },
        }
        const s = styles[type] ?? styles.NOTE
        elements.push(
          <div key={`callout-${i}`} className={`${s.bg} border-l-4 ${s.border} rounded-r-xl p-4 my-4`}>
            <p className={`text-xs font-bold ${s.text} mb-1.5`}>{s.icon} {s.label}</p>
            {calloutLines.map((cl, j) => (
              <p key={j} className={`text-sm ${s.text} leading-relaxed`}>{renderInline(cl)}</p>
            ))}
          </div>
        )
        continue
      }

      if (line.startsWith("## ")) {
        elements.push(
          <h2 key={i} className="text-lg font-bold text-gray-900 mt-8 mb-3 pb-2 border-b border-gray-100 first:mt-0">
            {line.slice(3)}
          </h2>
        )
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={i} className="text-base font-bold text-gray-800 mt-5 mb-2">
            {line.slice(4)}
          </h3>
        )
      } else if (line.startsWith("#### ")) {
        elements.push(
          <h4 key={i} className="text-sm font-bold text-gray-700 mt-4 mb-1.5">
            {line.slice(5)}
          </h4>
        )
      } else if (line.startsWith("| ")) {
        const tableLines: string[] = []
        while (i < lines.length && lines[i].startsWith("| ")) {
          tableLines.push(lines[i])
          i++
        }
        const headers = tableLines[0].split("|").filter((c) => c.trim()).map((c) => c.trim())
        const rows = tableLines.slice(2).map((r) =>
          r.split("|").filter((c) => c.trim()).map((c) => c.trim())
        )
        elements.push(
          <div key={`table-${i}`} className="overflow-x-auto my-4 rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {headers.map((h, j) => (
                    <th key={j} className="border-b border-gray-200 px-4 py-2.5 text-left font-semibold text-gray-700">
                      {renderInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, j) => (
                  <tr key={j} className={j % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    {row.map((cell, k) => (
                      <td key={k} className="border-b border-gray-100 px-4 py-2.5 text-gray-700 align-top">
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        continue
      } else if (line.startsWith("- ")) {
        const items: string[] = []
        while (i < lines.length && lines[i].startsWith("- ")) {
          items.push(lines[i].slice(2))
          i++
        }
        elements.push(
          <ul key={`ul-${i}`} className="space-y-1.5 my-3">
            {items.map((item, j) => (
              <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                <span className="leading-relaxed">{renderInline(item)}</span>
              </li>
            ))}
          </ul>
        )
        continue
      } else if (/^\d+\. /.test(line)) {
        const items: string[] = []
        while (i < lines.length && /^\d+\. /.test(lines[i])) {
          items.push(lines[i].replace(/^\d+\. /, ""))
          i++
        }
        elements.push(
          <ol key={`ol-${i}`} className="space-y-1.5 my-3">
            {items.map((item, j) => (
              <li key={j} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  {j + 1}
                </span>
                <span className="leading-relaxed">{renderInline(item)}</span>
              </li>
            ))}
          </ol>
        )
        continue
      } else if (line.startsWith("```")) {
        const codeLines: string[] = []
        i++
        while (i < lines.length && !lines[i].startsWith("```")) {
          codeLines.push(lines[i])
          i++
        }
        elements.push(
          <pre key={`code-${i}`} className="bg-gray-900 text-gray-100 rounded-xl p-4 my-4 text-sm overflow-x-auto">
            <code>{codeLines.join("\n")}</code>
          </pre>
        )
      } else if (line.startsWith("> ") && !line.match(/^>\s*\[!/)) {
        elements.push(
          <blockquote key={i} className="border-l-4 border-blue-400 pl-4 py-2 my-3 bg-blue-50 rounded-r-xl">
            <p className="text-sm text-blue-900 leading-relaxed">{renderInline(line.slice(2))}</p>
          </blockquote>
        )
      } else if (line === "---") {
        elements.push(<hr key={i} className="my-6 border-gray-200" />)
      } else if (line === "") {
        elements.push(<div key={i} className="h-2" />)
      } else {
        elements.push(
          <p key={i} className="text-sm text-gray-700 leading-relaxed">
            {renderInline(line)}
          </p>
        )
      }
      i++
    }
    return elements
  }

  function renderInline(text: string): React.ReactNode {
    // **bold** と `code` をサポート
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={i} className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>
      }
      return part
    })
  }

  const quizToShow = relatedQuestions.slice(0, 2)

  return (
    <div>
      {/* ヘッダー */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            第{chapter.id}章
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            topic.keyPoints.length > 4 ? "bg-red-100 text-red-700" :
            topic.keyPoints.length > 2 ? "bg-amber-100 text-amber-700" :
            "bg-green-100 text-green-700"
          }`}>
            {topic.keyPoints.length > 4 ? "やや難" : topic.keyPoints.length > 2 ? "標準" : "基礎"}
          </span>
          {isCompleted && (
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ✓ 完了
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{topic.title}</h1>
      </div>

      {/* 目次（セクションが3つ以上ある場合表示） */}
      {toc.length >= 3 && (
        <nav className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
          <p className="text-xs font-bold text-gray-500 mb-2">このトピックの内容</p>
          <ol className="space-y-1">
            {toc.map((section, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-xs text-gray-400">{i + 1}.</span>
                {section}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* 本文 */}
      <div>{renderContent(topic.content)}</div>

      {/* キーポイント */}
      {topic.keyPoints.length > 0 && (
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
            ⭐ このトピックのキーポイント（試験によく出る）
          </h3>
          <ul className="space-y-2.5">
            {topic.keyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-amber-800">
                <span className="flex-shrink-0 w-5 h-5 bg-amber-300 text-amber-900 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 用語フラッシュカード */}
      {topic.terms.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            📖 重要用語（クリックで定義を確認）
          </h3>
          <div className="grid gap-2">
            {topic.terms.map((term, i) => (
              <FlashCard key={i} word={term.word} definition={term.definition} />
            ))}
          </div>
        </div>
      )}

      {/* 確認問題 */}
      {quizToShow.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-bold text-violet-700 mb-3 flex items-center gap-2">
            ✏️ 確認問題（理解度チェック）
          </h3>
          <div className="space-y-4">
            {quizToShow.map((q) => (
              <MiniQuiz key={q.id} question={q} />
            ))}
          </div>
        </div>
      )}

      {/* 完了ボタン */}
      <div className="mt-8">
        <button
          onClick={markComplete}
          className={`w-full py-3.5 rounded-xl font-medium text-sm transition-colors ${
            isCompleted
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-300"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          }`}
        >
          {isCompleted ? "✓ 完了済み（クリックで取り消し）" : "このトピックを完了としてマーク ✓"}
        </button>
      </div>
    </div>
  )
}
