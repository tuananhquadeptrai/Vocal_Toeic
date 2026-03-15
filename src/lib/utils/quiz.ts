import type {
  QuestionType,
  QuizQuestion,
  QuizSetup,
  VocabularyWord,
  WordStatus,
} from "@/lib/types";
import { normalizeAnswer } from "./text";

export function calculateAccuracy(correctCount: number, questionCount: number) {
  if (questionCount === 0) {
    return 0;
  }

  return Math.round((correctCount / questionCount) * 100);
}

export function isWordEligibleForQuestion(
  word: VocabularyWord,
  questionType: QuestionType,
) {
  if (questionType === "meaning") {
    return word.normalizedMeanings.length > 0;
  }

  return word.normalizedSynonyms.length > 0;
}

export function isWordEligibleForSetup(word: VocabularyWord, mode: QuizSetup["mode"]) {
  if (mode === "mixed" || mode === "wrong-only") {
    return (
      isWordEligibleForQuestion(word, "meaning") ||
      isWordEligibleForQuestion(word, "synonym")
    );
  }

  return isWordEligibleForQuestion(word, mode);
}

export function getWordStatus(word: VocabularyWord): WordStatus {
  if (word.wrongCount >= 3) {
    return "weak";
  }

  if (word.reviewCount === 0) {
    return "new";
  }

  if (word.correctCount > word.wrongCount) {
    return "reviewed";
  }

  return "learning";
}

export function buildQuizQuestions(words: VocabularyWord[], setup: QuizSetup) {
  const filteredWords = words.filter((word) => {
    const matchesTopic = !setup.topic || word.topic === setup.topic;
    const matchesWrongOnly = setup.mode !== "wrong-only" || word.wrongCount > 0;

    return matchesTopic && matchesWrongOnly && isWordEligibleForSetup(word, setup.mode);
  });

  const questions: QuizQuestion[] = filteredWords.flatMap((word) => {
    const candidates: QuizQuestion[] = [];

    if (setup.mode === "mixed" || setup.mode === "meaning" || setup.mode === "wrong-only") {
      if (word.normalizedMeanings.length > 0) {
        candidates.push({
          id: `${word.id}-meaning`,
          wordId: word.id,
          prompt: word.word,
          answers: word.meanings,
          questionType: "meaning",
          topic: word.topic,
        });
      }
    }

    if (setup.mode === "mixed" || setup.mode === "synonym" || setup.mode === "wrong-only") {
      if (word.normalizedSynonyms.length > 0) {
        candidates.push({
          id: `${word.id}-synonym`,
          wordId: word.id,
          prompt: word.word,
          answers: word.synonyms,
          questionType: "synonym",
          topic: word.topic,
        });
      }
    }

    return candidates;
  });

  return shuffle(questions).slice(0, setup.questionCount);
}

export function isAnswerCorrect(userAnswer: string, acceptedAnswers: string[]) {
  const normalizedInput = normalizeAnswer(userAnswer);

  return acceptedAnswers.some((answer) => normalizeAnswer(answer) === normalizedInput);
}

function shuffle<T>(items: T[]) {
  const cloned = [...items];

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[swapIndex]] = [cloned[swapIndex], cloned[index]];
  }

  return cloned;
}
