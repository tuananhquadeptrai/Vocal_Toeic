"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { SectionCard } from "@/components/layout/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { appDb } from "@/lib/db/app-db";
import type { VocabularyFormValues, VocabularyWord } from "@/lib/types";
import { getWordStatus } from "@/lib/utils/quiz";
import { dedupeNormalizedValues, normalizeAnswer, splitListInput } from "@/lib/utils/text";
import { vocabularyFormSchema } from "@/lib/validators/vocabulary";

interface VocabularyFormShellProps {
  currentPath: string;
  mode: "create" | "edit";
  wordId?: string;
}

const emptyValues: VocabularyFormValues = {
  word: "",
  meaningsInput: "",
  synonymsInput: "",
  example: "",
  topic: "",
};

type VocabularyFormSchemaValues = z.infer<typeof vocabularyFormSchema>;

export function VocabularyFormShell({
  currentPath,
  mode,
  wordId,
}: VocabularyFormShellProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(mode === "edit");
  const [notFound, setNotFound] = useState(false);
  const form = useForm<VocabularyFormSchemaValues>({
    defaultValues: emptyValues,
    resolver: zodResolver(vocabularyFormSchema),
  });

  useEffect(() => {
    if (mode !== "edit" || !wordId) {
      return;
    }

    async function loadWord(targetId: string) {
      const existingWord = await appDb.vocabularyWords.get(targetId);

      if (!existingWord) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      form.reset({
        word: existingWord.word,
        meaningsInput: existingWord.meanings.join(", "),
        synonymsInput: existingWord.synonyms.join(", "),
        example: existingWord.example || "",
        topic: existingWord.topic || "",
      });
      setLoading(false);
    }

    void loadWord(wordId);
  }, [form, mode, wordId]);

  async function onSubmit(values: VocabularyFormSchemaValues) {
    const now = new Date().toISOString();
    const meanings = dedupeNormalizedValues(splitListInput(values.meaningsInput));
    const synonyms = dedupeNormalizedValues(splitListInput(values.synonymsInput)).filter(
      (synonym) => normalizeAnswer(synonym) !== normalizeAnswer(values.word),
    );

    const basePayload = {
      word: values.word.trim(),
      normalizedWord: normalizeAnswer(values.word),
      meanings,
      normalizedMeanings: meanings.map(normalizeAnswer),
      synonyms,
      normalizedSynonyms: synonyms.map(normalizeAnswer),
      example: values.example.trim() || undefined,
      topic: values.topic.trim() || undefined,
      updatedAt: now,
    };

    if (mode === "create") {
      const draft: VocabularyWord = {
        id: crypto.randomUUID(),
        createdAt: now,
        reviewCount: 0,
        correctCount: 0,
        wrongCount: 0,
        lastReviewedAt: undefined,
        status: "new",
        ...basePayload,
      };

      draft.status = getWordStatus(draft);
      await appDb.vocabularyWords.add(draft);
    } else if (wordId) {
      const targetId = wordId;
      const existingWord = await appDb.vocabularyWords.get(targetId);

      if (!existingWord) {
        setNotFound(true);
        return;
      }

      const updatedWord: VocabularyWord = {
        ...existingWord,
        ...basePayload,
      };

      updatedWord.status = getWordStatus(updatedWord);
      await appDb.vocabularyWords.put(updatedWord);
    }

    router.push("/vocabulary");
  }

  return (
    <AppShell currentPath={currentPath}>
      <div className="space-y-6">
        <PageHeader
          eyebrow={mode === "create" ? "New Word" : "Edit Word"}
          title={
            mode === "create"
              ? "Capture a new vocabulary item quickly."
              : "Adjust the stored answers before the next quiz."
          }
          description="This form is connected to React Hook Form, Zod validation, and Dexie persistence, so it is ready to evolve into a richer editor with tags, examples, and batch actions."
          badge={mode === "create" ? "Create flow" : "Edit flow"}
        />

        <SectionCard title="Vocabulary form" description="Use comma, line break, or the | symbol to separate multiple meanings and synonyms.">
          {loading ? (
            <p className="text-sm leading-7 text-muted-foreground">Loading word data...</p>
          ) : notFound ? (
            <div className="space-y-4">
              <Badge variant="danger">Word not found</Badge>
              <p className="text-sm leading-7 text-muted-foreground">
                The requested vocabulary entry does not exist in local storage.
              </p>
              <Button asChild variant="secondary">
                <Link href="/vocabulary">Back to list</Link>
              </Button>
            </div>
          ) : (
            <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
              <Field label="English word" error={form.formState.errors.word?.message}>
                <Input placeholder="accurate" {...form.register("word")} />
              </Field>

              <Field label="Meanings" error={form.formState.errors.meaningsInput?.message}>
                <Textarea className="min-h-28" placeholder="chinh xac, dung" {...form.register("meaningsInput")} />
              </Field>

              <Field label="Synonyms" error={form.formState.errors.synonymsInput?.message}>
                <Textarea className="min-h-24" placeholder="precise, exact" {...form.register("synonymsInput")} />
              </Field>

              <div className="grid gap-5 lg:grid-cols-2">
                <Field label="Topic">
                  <Input placeholder="exam" {...form.register("topic")} />
                </Field>
                <Field label="Example">
                  <Input placeholder="The answer needs to be accurate." {...form.register("example")} />
                </Field>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit">
                  {form.formState.isSubmitting
                    ? "Saving..."
                    : mode === "create"
                      ? "Save word"
                      : "Update word"}
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/vocabulary">Cancel</Link>
                </Button>
              </div>
            </form>
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <Label>{label}</Label>
      {children}
      {error ? <span className="text-sm text-destructive">{error}</span> : null}
    </label>
  );
}
