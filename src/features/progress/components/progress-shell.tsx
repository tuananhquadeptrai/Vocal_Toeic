"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { SectionCard } from "@/components/layout/section-card";
import { appDb } from "@/lib/db/app-db";
import type { QuizSession, VocabularyWord } from "@/lib/types";

interface ProgressState {
  sessions: QuizSession[];
  weakWords: VocabularyWord[];
}

export function ProgressShell() {
  const [state, setState] = useState<ProgressState>({
    sessions: [],
    weakWords: [],
  });

  useEffect(() => {
    async function loadProgress() {
      const [sessions, weakWords] = await Promise.all([
        appDb.quizSessions.orderBy("startedAt").reverse().limit(8).toArray(),
        appDb.vocabularyWords.where("status").equals("weak").toArray(),
      ]);

      setState({ sessions, weakWords });
    }

    void loadProgress();
  }, []);

  return (
    <AppShell currentPath="/progress">
      <div className="space-y-6">
        <PageHeader
          eyebrow="Progress"
          title="A simple analytics layer is already separated from quiz execution."
          description="For now this screen focuses on recent sessions and weak words, but the folder structure supports daily charts, topic insights, and repeat scheduling later."
          badge={`${state.sessions.length} recent sessions`}
        />

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <SectionCard title="Recent sessions" description="Latest stored quiz sessions from IndexedDB.">
            <div className="grid gap-3">
              {state.sessions.length > 0 ? (
                state.sessions.map((session) => (
                  <div
                    className="surface-strong flex items-center justify-between rounded-[1.25rem] border border-border px-4 py-3"
                    key={session.id}
                  >
                    <div>
                      <p className="font-medium">{session.mode}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.correctCount}/{session.questionCount} correct
                      </p>
                    </div>
                    <p className="text-xl font-semibold">{session.accuracy}%</p>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-7 text-muted-foreground">
                  No stored sessions yet. Complete a quiz to populate this area.
                </p>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Weak words" description="Words flagged by wrong-answer history.">
            <div className="grid gap-3">
              {state.weakWords.length > 0 ? (
                state.weakWords.map((word) => (
                  <div className="surface-strong rounded-[1.25rem] border border-border p-4" key={word.id}>
                    <p className="font-medium">{word.word}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      wrongCount: {word.wrongCount} / reviewCount: {word.reviewCount}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-7 text-muted-foreground">
                  No weak words yet. That usually means either your words are still new or recent sessions went well.
                </p>
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
