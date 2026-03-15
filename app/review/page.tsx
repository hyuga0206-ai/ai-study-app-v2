import Link from "next/link"

export default function ReviewPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">復習</h1>
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center mt-8">
        <p className="text-4xl mb-4">📝</p>
        <p className="text-lg font-semibold text-gray-900">まずは演習を解きましょう</p>
        <p className="text-sm text-gray-500 mt-2">問題を解くと、間違えた問題がここに表示されます。</p>
        <Link
          href="/quiz"
          className="inline-block mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          演習トップへ
        </Link>
      </div>
    </div>
  )
}
