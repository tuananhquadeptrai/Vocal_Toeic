import type { VocabularyWord } from "./vocabulary";

export type QuestionType = "meaning" | "synonym";
export type QuizMode = "mixed" | "meaning" | "synonym" | "wrong-only";

export interface QuizQuestion {
  id: string;
  wordId: string;
  prompt: string;
  answers: string[];
  questionType: QuestionType;
  topic?: string;
}

export interface QuizSetup {
  mode: QuizMode;
  topic: string;
  questionCount: number;
}

export interface QuizSession {
  id: string;
  mode: QuizMode;
  topic?: string;
  questionCount: number;
  correctCount: number;
  wrongCount: number;
  accuracy: number;
  startedAt: string;
  finishedAt?: string;
}

export interface QuizAnswer {
  id: string;
  sessionId: string;
  wordId: string;
  questionType: QuestionType;
  prompt: string;
  userAnswer: string;
  normalizedUserAnswer: string;
  isCorrect: boolean;
  acceptedAnswer: string;
  answeredAt: string;
}

export interface QuizResultState {
  session: QuizSession;
  answers: QuizAnswer[];
  weakWords: VocabularyWord[];
}
