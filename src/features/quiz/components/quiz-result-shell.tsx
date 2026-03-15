"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { SectionCard } from "@/components/layout/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useQuizSetupStore } from "../store/use-quiz-setup-store";

export function QuizResultShell() {
  const { latestResult } = useQuizSetupStore();

  if (!latestResult) {
    return (
      <AppShell currentPath="/quiz/setup">
        <div className="space-y-6">
          <PageHeader
            eyebrow="Quiz Result"
            title="No in-memory result is available yet."
            description="Run a session first to populate this screen, or later connect it to a route param for deep links."
            badge="Awaiting session"
          />
          <EmptyState
            actionHref="/quiz/setup"
            actionLabel="Go to setup"
            description="This scaffold currently stores the latest session in Zustand for a quick result flow."
            title="No result found"
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell currentPath="/quiz/setup">
      <div className="space-y-6">
        <PageHeader
          eyebrow="Quiz Result"
          title={`Session finished with ${latestResult.session.accuracy}% accuracy.`}
          description="The result flow already separates session summary from individual answers, which is a good base for progress charts and spaced repetition later."
          badge={`${latestResult.session.correctCount}/${latestResult.session.questionCount} correct`}
        />

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionCard title="Summary" description="High-level outcome of the session.">
            <div className="grid gap-3">
              <SummaryRow label="Mode" value={latestResult.session.mode} />
              <SummaryRow label="Topic" value={latestResult.session.topic || "All topics"} />
              <SummaryRow
                label="Wrong answers"
                value={latestResult.session.wrongCount.toString()}
              />
              <SummaryRow label="Weak words" value={latestResult.weakWords.length.toString()} />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/quiz/setup">Run another quiz</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/progress">Open progress</Link>
              </Button>
            </div>
          </SectionCard>

          <SectionCard
            title="Answer review"
            description="Use this list later for retry, flashcard conversion, or post-session explanations."
          >
            <div className="grid gap-3">
              {latestResult.answers.map((answer) => (
                <div className="surface-strong rounded-[1.25rem] border border-border p-4" key={answer.id}>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={answer.isCorrect ? "success" : "danger"}>
                      {answer.isCorrect ? "Correct" : "Wrong"}
                    </Badge>
                    <Badge variant="outline">{answer.questionType}</Badge>
                  </div>
                  <p className="mt-3 font-medium">{answer.prompt}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your answer: {answer.userAnswer || "No answer"}
                  </p>
                  {!answer.isCorrect ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Accepted answer: {answer.acceptedAnswer}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-strong flex items-center justify-between rounded-[1.25rem] border border-border px-4 py-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
