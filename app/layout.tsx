import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/Sidebar"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AIガバナンス Study",
  description: "金融機関における生成AIガイドライン学習アプリ",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${geist.className} bg-gray-50 text-gray-900 antialiased`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 min-h-screen md:ml-64 pt-16 md:pt-0">{children}</main>
        </div>
      </body>
    </html>
  )
}
