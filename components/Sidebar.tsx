"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { chapters } from "@/data/chapters"

const navItems = [
  { href: "/", label: "ダッシュボード", icon: "🏠" },
  { href: "/chapters", label: "章で学習", icon: "📚" },
  { href: "/quiz", label: "問題演習", icon: "✏️" },
  { href: "/review", label: "復習", icon: "🔁" },
  { href: "/progress", label: "進捗", icon: "📊" },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // ページ遷移時にメニューを閉じる
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      {/* モバイル用ハンバーガーボタン */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed top-4 left-4 z-50 md:hidden flex items-center justify-center w-10 h-10 bg-slate-900 text-white rounded-lg shadow-lg"
        aria-label="メニューを開く"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* オーバーレイ（モバイルでメニュー開時） */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* サイドバー本体 */}
      <aside className={`
        fixed left-0 top-0 h-full w-64 bg-slate-900 text-white flex flex-col z-40
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}>
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-sm font-bold text-slate-300 leading-tight">
            金融機関における
          </h1>
          <h1 className="text-sm font-bold text-white leading-tight">
            生成AIガイドライン
          </h1>
          <p className="text-xs text-slate-400 mt-1">第1.1版 学習アプリ</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    pathname === item.href
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>

                {item.href === "/chapters" && pathname.startsWith("/chapters") && (
                  <ul className="mt-1 ml-4 space-y-0.5">
                    {chapters.map((ch) => (
                      <li key={ch.id}>
                        <Link
                          href={`/chapters/${ch.id}`}
                          className={`block px-3 py-1.5 rounded text-xs transition-colors ${
                            pathname === `/chapters/${ch.id}`
                              ? "text-blue-400 font-medium"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          第{ch.id}章 {ch.title.slice(0, 12)}…
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <p className="text-xs text-slate-500">FDUA 第1.1版（2025年7月）</p>
        </div>
      </aside>
    </>
  )
}
