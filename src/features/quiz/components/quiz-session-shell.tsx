"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { SectionCard } from "@/components/layout/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { appDb } from "@/lib/db/app-db";
import type { QuizAnswer, QuizQuestion, QuizSession, VocabularyWord } from "@/lib/types";
import {
  buildQuizQuestions,
  calculateAccuracy,
  getWordStatus,
  isAnswerCorrect,
} from "@/lib/utils/quiz";
import { normalizeAnswer } from "@/lib/utils/text";
import { useQuizSetupStore } from "../store/use-quiz-setup-store";

export function QuizSessionShell() {
  const router = useRouter();
  const { setup, setLatestResult } = useQuizSetupStore();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [startedAt] = useState(() => new Date().toISOString());

  useEffect(() => {
    async function loadSession() {
      const storedWords = await appDb.vocabularyWords.toArray();
      setWords(storedWords);
      setQuestions(buildQuizQuestions(storedWords, setup));
    }

    void loadSession();
  }, [setup]);

  const currentQuestion = questions[currentIndex];
  const currentResult = useMemo(() => answers[currentIndex], [answers, currentIndex]);

  if (!currentQuestion) {
    return (
      <AppShell currentPath="/quiz/setup">
        <div className="space-y-6">
          <PageHeader
            eyebrow="Quiz Session"
            title="There is not enough valid data to build this session yet."
            description="Add more words, meanings, or synonyms first, then come back to run a real quiz session."
            badge="No valid questions"
          />
          <EmptyState
            actionHref="/vocabulary/new"
            actionLabel="Add more vocabulary"
            description="At least a few meaning-ready or synonym-ready words are needed before a quiz can be generated."
            title="Quiz pool is empty"
          />
        </div>
      </AppShell>
    );
  }

  async function handleSubmit() {
    if (submitted) {
      if (currentIndex === questions.length - 1) {
        await finishSession();
        return;
      }

      setSubmitted(false);
      setCurrentAnswer("");
      setCurrentIndex((index) => index + 1);
      return;
    }

    const now = new Date().toISOString();
    const answer: QuizAnswer = {
      id: crypto.randomUUID(),
      sessionId: "pending",
      wordId: currentQuestion.wordId,
      questionType: currentQuestion.questionType,
      prompt: currentQuestion.prompt,
      userAnswer: currentAnswer,
      normalizedUserAnswer: normalizeAnswer(currentAnswer),
      isCorrect: isAnswerCorrect(currentAnswer, currentQuestion.answers),
      acceptedAnswer: currentQuestion.answers[0],
      answeredAt: now,
    };

    setAnswers((previous) => [...previous, answer]);
    setSubmitted(true);
  }

  async function finishSession() {
    const sessionId = crypto.randomUUID();
    const finishedAt = new Date().toISOString();
    const correctCount = answers.filter((answer) => answer.isCorrect).length;
    const wrongCount = answers.length - correctCount;
    const accuracy = calculateAccuracy(correctCount, answers.length);

    const session: QuizSession = {
      id: sessionId,
      mode: setup.mode,
      topic: setup.topic || undefined,
      questionCount: answers.length,
      correctCount,
      wrongCount,
      accuracy,
      startedAt,
      finishedAt,
    };

    const persistedAnswers = answers.map((answer) => ({
      ...answer,
      sessionId,
    }));

    const touchedWordIds = new Set(answers.map((answer) => answer.wordId));
    const wordUpdates = words
      .filter((word) => touchedWordIds.has(word.id))
      .map((word) => {
        const relatedAnswers = answers.filter((answer) => answer.wordId === word.id);
        const addedCorrect = relatedAnswers.filter((answer) => answer.isCorrect).length;
        const addedWrong = relatedAnswers.length - addedCorrect;
        const updatedWord: VocabularyWord = {
          ...word,
          reviewCount: word.reviewCount + relatedAnswers.length,
          correctCount: word.correctCount + addedCorrect,
          wrongCount: word.wrongCount + addedWrong,
          lastReviewedAt: finishedAt,
          updatedAt: finishedAt,
          status: word.status,
        };

        updatedWord.status = getWordStatus(updatedWord);
        return updatedWord;
      });

    await appDb.transaction(
      "rw",
      appDb.quizSessions,
      appDb.quizAnswers,
      appDb.vocabularyWords,
      async () => {
        await appDb.quizSessions.add(session);
        await appDb.quizAnswers.bulkAdd(persistedAnswers);
        await appDb.vocabularyWords.bulkPut(wordUpdates);
      },
    );

    setLatestResult({
      session,
      answers: persistedAnswers,
      weakWords: wordUpdates.filter((word) => word.status === "weak"),
    });
    router.push("/quiz/result");
  }

  return (
    <AppShell currentPath="/quiz/setup">
      <div className="space-y-6">
        <PageHeader
          eyebrow="Quiz Session"
          title="Answer one prompt at a time with immediate feedback."
          description="This is a lightweight session implementation: it generates questions from local data, checks answers instantly, stores results, and updates word-level counters."
          badge={`${currentIndex + 1} / ${questions.length}`}
        />

        <SectionCard
          title={currentQuestion.prompt}
          description={
            currentQuestion.questionType === "meaning"
              ? "Nhap nghia tieng Viet hop le cho tu nay."
              : "Nhap mot synonym hop le cho tu nay."
          }
        >
          <div className="flex flex-wrap gap-2">
            <Badge variant="accent">{currentQuestion.questionType}</Badge>
            {currentQuestion.topic ? <Badge variant="outline">{currentQuestion.topic}</Badge> : null}
          </div>

          <div className="mt-5 grid gap-4">
            <Input
              autoFocus
              disabled={submitted}
              onChange={(event) => setCurrentAnswer(event.target.value)}
              placeholder="Type your answer here"
              value={currentAnswer}
            />

            {submitted && currentResult ? (
              <div className="surface-strong rounded-[1.5rem] border border-border p-4">
                <p
                  className={
                    currentResult.isCorrect
                      ? "text-sm font-medium text-success"
                      : "text-sm font-medium text-danger"
                  }
                >
                  {currentResult.isCorrect ? "Correct answer" : "Not quite right"}
                </p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Accepted answer: {currentResult.acceptedAnswer}
                </p>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <Button disabled={!currentAnswer.trim() && !submitted} onClick={() => void handleSubmit()}>
                {submitted
                  ? currentIndex === questions.length - 1
                    ? "Finish session"
                    : "Next question"
                  : "Submit answer"}
              </Button>
              <Button asChild variant="secondary">
                <Link href="/quiz/setup">Back to setup</Link>
              </Button>
            </div>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
