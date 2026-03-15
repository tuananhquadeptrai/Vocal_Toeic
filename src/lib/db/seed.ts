"use client";

import { sampleVocabularyRows } from "@/lib/constants/sample-data";
import { getWordStatus } from "@/lib/utils/quiz";
import { dedupeNormalizedValues, normalizeAnswer } from "@/lib/utils/text";
import type { VocabularyWord } from "@/lib/types";
import { appDb } from "./app-db";

let seedingPromise: Promise<void> | null = null;

function buildWord(row: (typeof sampleVocabularyRows)[number]): VocabularyWord {
  const createdAt = new Date().toISOString();
  const meanings = dedupeNormalizedValues(row.meanings);
  const synonyms = dedupeNormalizedValues(row.synonyms);

  const draft: VocabularyWord = {
    id: crypto.randomUUID(),
    word: row.word.trim(),
    normalizedWord: normalizeAnswer(row.word),
    meanings,
    normalizedMeanings: meanings.map(normalizeAnswer),
    synonyms,
    normalizedSynonyms: synonyms.map(normalizeAnswer),
    example: row.example?.trim() || undefined,
    topic: row.topic?.trim() || undefined,
    status: "new",
    reviewCount: 0,
    correctCount: 0,
    wrongCount: 0,
    lastReviewedAt: undefined,
    createdAt,
    updatedAt: createdAt,
  };

  return { ...draft, status: getWordStatus(draft) };
}

export async function ensureSeedData() {
  if (typeof window === "undefined") {
    return;
  }

  if (seedingPromise) {
    return seedingPromise;
  }

  seedingPromise = (async () => {
    const existingCount = await appDb.vocabularyWords.count();

    if (existingCount > 0) {
      return;
    }

    await appDb.vocabularyWords.bulkAdd(sampleVocabularyRows.map(buildWord));
  })();

  return seedingPromise;
}
