"use client";

import Dexie, { type Table } from "dexie";
import type { QuizAnswer, QuizSession, VocabularyWord } from "@/lib/types";

export class QuizzzDatabase extends Dexie {
  vocabularyWords!: Table<VocabularyWord, string>;
  quizSessions!: Table<QuizSession, string>;
  quizAnswers!: Table<QuizAnswer, string>;

  constructor() {
    super("quizzz-db");

    this.version(1).stores({
      vocabularyWords:
        "id, normalizedWord, topic, status, reviewCount, wrongCount, createdAt, updatedAt, lastReviewedAt",
      quizSessions: "id, mode, topic, startedAt, finishedAt",
      quizAnswers: "id, sessionId, wordId, questionType, answeredAt",
    });
  }
}

export const appDb = new QuizzzDatabase();
