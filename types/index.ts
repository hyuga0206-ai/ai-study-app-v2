export interface Term {
  word: string
  definition: string
}

export interface Topic {
  id: string
  chapterId: number
  title: string
  content: string
  keyPoints: string[]
  terms: Term[]
}

export interface Chapter {
  id: number
  title: string
  summary: string
  keywords: string[]
  topics: Topic[]
}

export interface Question {
  id: string
  chapterId: number
  topicId: string
  difficulty: "basic" | "intermediate" | "advanced"
  text: string
  options: string[]
  correctIdx: number
  explanation: string
}

export interface QuizSessionResult {
  sessionId: number
  questions: Question[]
  answers: { questionId: string; selectedIdx: number; isCorrect: boolean }[]
}
