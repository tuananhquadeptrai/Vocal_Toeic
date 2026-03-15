"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { SectionCard } from "@/components/layout/section-card";
import { StatCard } from "@/components/layout/stat-card";
import { Button } from "@/components/ui/button";
import { appDb } from "@/lib/db/app-db";
import type { QuizSession, VocabularyWord } from "@/lib/types";

interface DashboardStats {
  totalWords: number;
  weakWords: number;
  sessions: number;
}

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalWords: 0,
    weakWords: 0,
    sessions: 0,
  });
  const [recentWords, setRecentWords] = useState<VocabularyWord[]>([]);
  const [recentSessions, setRecentSessions] = useState<QuizSession[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      const [words, sessions] = await Promise.all([
        appDb.vocabularyWords.orderBy("createdAt").reverse().toArray(),
        appDb.quizSessions.orderBy("startedAt").reverse().limit(3).toArray(),
      ]);

      setStats({
        totalWords: words.length,
        weakWords: words.filter((word) => word.status === "weak").length,
        sessions: sessions.length,
      });
      setRecentWords(words.slice(0, 4));
      setRecentSessions(sessions);
    }

    void loadDashboard();
  }, []);

  return (
    <AppShell currentPath="/">
      <div className="space-y-6">
        <PageHeader
          eyebrow="Dashboard"
          title="Personal vocabulary trainer built for short daily reps."
          description="This scaffold already includes local data storage, vocabulary forms, quiz setup, result flow, and the core folder structure to keep building feature by feature."
          badge="MVP scaffold ready"
        />

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard hint="Seeded locally" label="Total words" tone="accent" value={stats.totalWords.toString()} />
          <StatCard hint="Need review" label="Weak words" tone="warning" value={stats.weakWords.toString()} />
          <StatCard
            hint="Stored in IndexedDB"
            label="Recent sessions"
            tone="success"
            value={stats.sessions.toString()}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <SectionCard
            title="Build loop"
            description="The product loop is already mapped into separate routes so you can continue coding module by module."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="surface-strong rounded-[1.5rem] border border-border p-4">
                <h4 className="text-lg font-medium">Start with vocabulary</h4>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Add, edit, filter, and tag personal word banks before expanding quiz intelligence.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href="/vocabulary">Open vocabulary</Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href="/vocabulary/new">Add a word</Link>
                  </Button>
                </div>
              </div>
              <div className="surface-strong rounded-[1.5rem] border border-border p-4">
                <h4 className="text-lg font-medium">Move into quiz flow</h4>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Quiz setup, session state, and result persistence are ready for deeper scoring logic.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href="/quiz/setup">Configure quiz</Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href="/progress">See progress</Link>
                  </Button>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Fresh local data"
            description="Sample words are seeded automatically so every screen has useful data on first launch."
          >
            <div className="space-y-3">
              {recentWords.map((word) => (
                <div
                  className="surface-strong flex items-center justify-between rounded-[1.25rem] border border-border px-4 py-3"
                  key={word.id}
                >
                  <div>
                    <p className="font-medium">{word.word}</p>
                    <p className="text-sm text-muted-foreground">
                      {word.meanings.join(", ")}
                      {word.topic ? ` / ${word.topic}` : ""}
                    </p>
                  </div>
                  <Button asChild variant="ghost">
                    <Link href={`/vocabulary/${word.id}/edit`}>Edit</Link>
                  </Button>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <SectionCard
          title="Recent activity"
          description="Sessions are stored separately from answers to make future analytics and spaced repetition easier to add."
        >
          {recentSessions.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-3">
              {recentSessions.map((session) => (
                <div className="surface-strong rounded-[1.25rem] border border-border p-4" key={session.id}>
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                    {session.mode}
                  </p>
                  <p className="mt-4 text-2xl font-semibold">{session.accuracy}%</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {session.correctCount}/{session.questionCount} correct
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-7 text-muted-foreground">
              No quiz sessions yet. Run your first session from the quiz setup screen.
            </p>
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}
