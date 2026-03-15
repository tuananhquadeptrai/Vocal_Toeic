"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import type { z } from "zod";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { SectionCard } from "@/components/layout/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { appDb } from "@/lib/db/app-db";
import type { VocabularyWord } from "@/lib/types";
import { isWordEligibleForQuestion } from "@/lib/utils/quiz";
import { quizSetupSchema } from "@/lib/validators/quiz";
import { useQuizSetupStore } from "../store/use-quiz-setup-store";

type QuizSetupFormInput = z.input<typeof quizSetupSchema>;
type QuizSetupFormValues = z.output<typeof quizSetupSchema>;

export function QuizSetupShell() {
  const router = useRouter();
  const { setup, setSetup } = useQuizSetupStore();
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const form = useForm<QuizSetupFormInput, undefined, QuizSetupFormValues>({
    defaultValues: setup,
    resolver: zodResolver(quizSetupSchema),
  });
  const selectedMode = useWatch({ control: form.control, name: "mode" });
  const selectedTopic = useWatch({ control: form.control, name: "topic" });
  const selectedQuestionCount = useWatch({
    control: form.control,
    name: "questionCount",
  });

  useEffect(() => {
    async function loadWords() {
      setWords(await appDb.vocabularyWords.toArray());
    }

    void loadWords();
  }, []);

  const topics = useMemo(
    () =>
      Array.from(
        new Set(words.map((word) => word.topic).filter((item): item is string => Boolean(item))),
      ).sort(),
    [words],
  );

  const availability = useMemo(
    () => ({
      meaning: words.filter((word) => isWordEligibleForQuestion(word, "meaning")).length,
      synonym: words.filter((word) => isWordEligibleForQuestion(word, "synonym")).length,
      weak: words.filter((word) => word.wrongCount > 0).length,
    }),
    [words],
  );

  function onSubmit(values: QuizSetupFormValues) {
    setSetup(values);
    router.push("/quiz/session");
  }

  return (
    <AppShell currentPath="/quiz/setup">
      <div className="space-y-6">
        <PageHeader
          eyebrow="Quiz Setup"
          title="Configure the study session before you jump into answer mode."
          description="This screen is already connected to Zustand and reads available local data, so the next step is refining selection logic and session analytics."
          badge="Setup persisted in store"
        />

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <SectionCard title="Session options" description="Choose question mode, scope, and length.">
            <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
              <Field label="Quiz mode">
                <Select
                  onValueChange={(value) =>
                    form.setValue("mode", value as QuizSetupFormValues["mode"])
                  }
                  value={selectedMode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select quiz mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mixed">Mixed</SelectItem>
                    <SelectItem value="meaning">Meaning only</SelectItem>
                    <SelectItem value="synonym">Synonym only</SelectItem>
                    <SelectItem value="wrong-only">Wrong words only</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Topic">
                <Select
                  onValueChange={(value) => form.setValue("topic", value === "all" ? "" : value)}
                  value={selectedTopic || "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All topics" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All topics</SelectItem>
                    {topics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Question count">
                <Select
                  onValueChange={(value) => form.setValue("questionCount", Number(value))}
                  value={String(selectedQuestionCount ?? setup.questionCount)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select question count" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 8, 10, 12, 15].map((count) => (
                      <SelectItem key={count} value={String(count)}>
                        {count} questions
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Button type="submit">Start quiz</Button>
            </form>
          </SectionCard>

          <SectionCard
            title="Available question pool"
            description="Use these counts to decide when to gate quiz modes or show helper messaging."
          >
            <div className="grid gap-3">
              <AvailabilityRow label="Meaning-ready words" value={availability.meaning} />
              <AvailabilityRow label="Synonym-ready words" value={availability.synonym} />
              <AvailabilityRow label="Weak words for retry mode" value={availability.weak} />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge variant="accent">{words.length} stored words</Badge>
              <Badge variant="success">{topics.length} topics</Badge>
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </label>
  );
}

function AvailabilityRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="surface-strong flex items-center justify-between rounded-[1.25rem] border border-border px-4 py-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
