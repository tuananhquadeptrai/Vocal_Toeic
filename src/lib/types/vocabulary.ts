export type WordStatus = "new" | "learning" | "reviewed" | "weak";

export interface VocabularyWord {
  id: string;
  word: string;
  normalizedWord: string;
  meanings: string[];
  normalizedMeanings: string[];
  synonyms: string[];
  normalizedSynonyms: string[];
  example?: string;
  topic?: string;
  status: WordStatus;
  reviewCount: number;
  correctCount: number;
  wrongCount: number;
  lastReviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VocabularyFormValues {
  word: string;
  meaningsInput: string;
  synonymsInput: string;
  example: string;
  topic: string;
}

export interface VocabularyImportRow {
  word: string;
  meanings: string[];
  synonyms: string[];
  example?: string;
  topic?: string;
}
