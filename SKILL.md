# AI学習アプリ 作業手順書

このファイルは `ai-study-app-v2` の保守・更新作業を再現するための手順書です。

---

## プロジェクト概要

- **場所**: `C:\Users\hyuga\Desktop\claude\ai-study-app-v2`
- **技術スタック**: Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **公開先**: https://hyuga0206-ai.github.io/ai-study-app-v2
- **GitHub**: https://github.com/hyuga0206-ai/ai-study-app-v2
- **対象ガイドライン**: FDUA 金融機関における生成AIガイドライン 第1.1版

---

## 1. コンテンツ（学習内容）の更新

### ファイル
`data/chapters.ts` — すべての学習コンテンツが入っている唯一のファイル

### データ構造

```typescript
// chapters 配列の構造
{
  id: number,              // 章番号（1〜8）
  title: string,           // 章タイトル
  summary: string,         // 章の概要
  keywords: string[],      // キーワード一覧
  topics: [
    {
      id: string,          // "章番号-連番" 例: "2-3"
      chapterId: number,
      title: string,
      content: string,     // Markdownテキスト（テンプレートリテラル）
      keyPoints: string[], // キーポイント（試験に出るポイント）
      terms: [             // 重要用語
        { word: string, definition: string }
      ]
    }
  ]
}
```

### content フィールドの書き方ルール

content は Markdown 形式のテンプレートリテラル文字列。以下の構文が使える：

| 記法 | 表示 |
|------|------|
| `## 見出し` | 大見出し |
| `### 見出し` | 中見出し |
| `#### 見出し` | 小見出し |
| `**太字**` | 太字 |
| `` `コード` `` | インラインコード |
| `- 項目` | 箇条書き |
| `1. 項目` | 番号付きリスト |
| `\| col \| col \|` | テーブル |
| `---` | 水平線 |
| `> [!IMPORTANT]` | 重要ボックス（赤） |
| `> [!NOTE]` | 補足ボックス（青） |
| `> [!TIP]` | ポイントボックス（緑） |
| `> [!WARNING]` | 注意ボックス（黄） |

### ⚠️ 重要：コードブロックのエスケープ

**content 内でコードブロック（```）を使う場合は必ず `\`\`\`` と書くこと。**

```typescript
// NG（ビルドエラーになる）
content: `
\`\`\`
コードブロック
\`\`\`
`

// OK
content: `
\`\`\`
コードブロック
\`\`\`
`
```

template literal の末尾（閉じバッククォートの直前）のコードブロック終了は特殊：
```typescript
// NG
content: `テキスト
\`\`\`
最後のコードブロック
\`\`\``,   // ← ビルドエラー

// OK（コードブロック終了 + テンプレートリテラル終了を分離）
content: `テキスト
\`\`\`
最後のコードブロック
\`\`\``,   // ← \`\`\`（エスケープ×3）+ `（テンプレート終了）
```

### コンテンツ追加・編集の手順

1. `data/chapters.ts` を Read で読む
2. 対象トピックの行番号を確認（`grep -n '"トピックID"' data/chapters.ts`）
3. Edit ツールで `content: \`` から次のトピックの `},` までを書き換え
4. ビルド確認：`npm run build`（エラーが出たら行番号を確認してバッククォートを修正）
5. コミット＆プッシュ

### コンテンツの品質基準（ユーザー要求）

各トピックには以下を含めること：
- **何が大切か**（重要な概念・背景）
- **どの手順で進めるか**（Step 1→2→3 の流れ）
- **誰が何を実施するか**（経営層/AIガバナンス統括組織/業務部門/IT部門/コンプライアンス部門/業務担当者）

---

## 2. GitHub Pages へのデプロイ

### 仕組み
- `next.config.ts` に `output: "export"` を設定 → `npm run build` で `out/` フォルダに静的HTMLが生成される
- GitHub Actions（`.github/workflows/deploy.yml`）が main ブランチへの push を検知して自動ビルド＆デプロイ
- `basePath` は GitHub Actions 実行時に `NEXT_PUBLIC_BASE_PATH=/{リポジトリ名}` で自動設定される

### 制約事項（静的エクスポートのため）
- API ルート（`app/api/`）は使えない
- Prisma / データベースは使えない
- `searchParams` を使うサーバーコンポーネントは `generateStaticParams` か Client Component が必要

### 手動デプロイ手順
```bash
cd C:\Users\hyuga\Desktop\claude\ai-study-app-v2

# 変更をコミット
git add -A
git commit -m "変更内容の説明"
git push
```

プッシュ後、GitHub Actions が自動でビルド・デプロイ（2〜3分）。
進捗確認: https://github.com/hyuga0206-ai/ai-study-app-v2/actions

### 静的エクスポート対応のポイント
- 動的ルート（`[chapterId]`等）には `generateStaticParams()` が必要
- `searchParams` を使うページは `"use client"` + `useSearchParams()` + `<Suspense>` で対応
- Google Fonts（`next/font/google`）はビルド時にダウンロードされるので問題なし
- `public/.nojekyll` が必要（GitHubの Jekyll 処理で `_next/` が無視されるのを防ぐ）

---

## 3. UI 改善

### レスポンシブ対応の考え方
- モバイル：`md:` ブレークポイント未満（768px以下）
- PC：`md:` ブレークポイント以上

### サイドバーの動作
- **モバイル**: デフォルト非表示、左上ハンバーガーボタン（三本線）でトグル、オーバーレイをタップで閉じる、ページ遷移時に自動で閉じる
- **PC**: 常に表示（`md:translate-x-0`）

### メインコンテンツのレイアウト
```tsx
// layout.tsx
<main className="flex-1 min-h-screen md:ml-64 pt-16 md:pt-0">
  {/* pt-16 はモバイルでハンバーガーボタンの高さ分の余白 */}
  {/* md:ml-64 はPC用のサイドバー幅分の左マージン */}
```

---

## 4. よくある作業パターン

### 章のコンテンツを充実させる
```
1. data/chapters.ts の対象トピックを Read で確認
2. 現在の内容が薄い/手順が不明確な箇所を特定
3. 以下の観点で書き直す：
   - 何が重要か（背景・目的）
   - 誰が実施するか（役割分担）
   - どの手順で進めるか（Step形式）
   - 具体的な金融機関での事例
4. Edit ツールで content を書き換え
5. npm run build でビルド確認
6. git commit && git push
```

### 新しいトピックを追加する
```
1. 対象章の topics 配列の末尾に追加
2. id は "章番号-連番"（例: 既存が "3-3" まであれば "3-4"）
3. chapterId は章番号と同じ数値
4. content は Markdown 形式（バッククォートのエスケープに注意）
5. keyPoints は 5〜8 個、terms は関連用語を 2〜5 個
```

### ビルドエラーのデバッグ
```bash
# エラー行番号を確認
npm run build 2>&1 | grep "chapters.ts"

# 該当行のバッククォートを確認
node -e "
const fs = require('fs');
const lines = fs.readFileSync('data/chapters.ts','utf8').split('\n');
// エラー行番号の前後5行を表示
for(let i = エラー行-5; i < エラー行+5; i++) {
  console.log(i+1, JSON.stringify(lines[i]));
}
"
```

---

## 5. プロジェクト構成（主要ファイル）

```
ai-study-app-v2/
├── .github/workflows/deploy.yml   # GitHub Actions 自動デプロイ
├── app/
│   ├── layout.tsx                 # 全ページ共通レイアウト
│   ├── page.tsx                   # ダッシュボード
│   ├── chapters/
│   │   ├── page.tsx               # 章一覧
│   │   ├── [chapterId]/
│   │   │   ├── page.tsx           # 章詳細（generateStaticParams必要）
│   │   │   └── [topicId]/
│   │   │       └── page.tsx       # トピック詳細（generateStaticParams必要）
│   ├── quiz/
│   │   ├── page.tsx               # 演習トップ
│   │   └── session/page.tsx       # 演習セッション（Client Component）
│   ├── review/page.tsx            # 復習
│   └── progress/page.tsx          # 進捗
├── components/
│   ├── Sidebar.tsx                # サイドバー（モバイル対応）
│   ├── TopicContent.tsx           # トピック本文レンダラー
│   └── QuizSession.tsx            # クイズUI
├── data/
│   ├── chapters.ts                # 全学習コンテンツ（メインデータ）
│   └── questions.ts               # 演習問題データ
├── next.config.ts                 # output: "export" + basePath 設定
├── public/.nojekyll               # GitHub Pages 用（必須）
└── SKILL.md                       # この手順書
```
