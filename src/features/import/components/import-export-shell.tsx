"use client";

import { useMemo, useState } from "react";
import Papa from "papaparse";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { SectionCard } from "@/components/layout/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { appDb } from "@/lib/db/app-db";
import type { VocabularyImportRow, VocabularyWord } from "@/lib/types";
import { getWordStatus } from "@/lib/utils/quiz";
import { dedupeNormalizedValues, normalizeAnswer, splitListInput } from "@/lib/utils/text";

export function ImportExportShell() {
  const [rows, setRows] = useState<VocabularyImportRow[]>([]);
  const [message, setMessage] = useState("");

  const previewCount = useMemo(() => rows.length, [rows]);

  async function handleFileChange(file: File | null) {
    if (!file) {
      return;
    }

    const text = await file.text();
    const parsed = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
    });

    const normalizedRows = parsed.data
      .map((row) => ({
        word: row.word?.trim() || "",
        meanings: splitListInput(row.meanings || ""),
        synonyms: splitListInput(row.synonyms || ""),
        example: row.example?.trim() || "",
        topic: row.topic?.trim() || "",
      }))
      .filter((row) => row.word && row.meanings.length > 0);

    setRows(normalizedRows);
    setMessage(`Loaded ${normalizedRows.length} valid rows from CSV.`);
  }

  async function handleImport() {
    const now = new Date().toISOString();
    const words: VocabularyWord[] = rows.map((row) => {
      const meanings = dedupeNormalizedValues(row.meanings);
      const synonyms = dedupeNormalizedValues(row.synonyms);
      const draft: VocabularyWord = {
        id: crypto.randomUUID(),
        word: row.word,
        normalizedWord: normalizeAnswer(row.word),
        meanings,
        normalizedMeanings: meanings.map(normalizeAnswer),
        synonyms,
        normalizedSynonyms: synonyms.map(normalizeAnswer),
        example: row.example || undefined,
        topic: row.topic || undefined,
        status: "new",
        reviewCount: 0,
        correctCount: 0,
        wrongCount: 0,
        lastReviewedAt: undefined,
        createdAt: now,
        updatedAt: now,
      };

      draft.status = getWordStatus(draft);
      return draft;
    });

    await appDb.vocabularyWords.bulkPut(words);
    setMessage(`Imported ${words.length} rows into IndexedDB.`);
    setRows([]);
  }

  async function handleExportJson() {
    const words = await appDb.vocabularyWords.toArray();
    downloadFile("quizzz-vocabulary.json", JSON.stringify(words, null, 2), "application/json");
  }

  async function handleExportCsv() {
    const words = await appDb.vocabularyWords.toArray();
    const csv = Papa.unparse(
      words.map((word) => ({
        word: word.word,
        meanings: word.meanings.join(" | "),
        synonyms: word.synonyms.join(" | "),
        example: word.example || "",
        topic: word.topic || "",
      })),
    );

    downloadFile("quizzz-vocabulary.csv", csv, "text/csv;charset=utf-8");
  }

  return (
    <AppShell currentPath="/import">
      <div className="space-y-6">
        <PageHeader
          eyebrow="Import / Export"
          title="Move vocabulary in and out of the app without needing a backend."
          description="CSV import and JSON or CSV export are included so the local-first MVP still has a safe backup path and a practical onboarding flow."
          badge={`${previewCount} rows in preview`}
        />

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <SectionCard title="Import CSV" description="Expected columns: word, meanings, synonyms, example, topic.">
            <div className="grid gap-4">
              <Input
                accept=".csv"
                onChange={(event) => void handleFileChange(event.target.files?.[0] || null)}
                type="file"
              />
              <div className="flex flex-wrap gap-3">
                <Button disabled={rows.length === 0} onClick={() => void handleImport()}>
                  Import preview rows
                </Button>
                {message ? <Badge variant="success">{message}</Badge> : null}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Export backup" description="Use export regularly while the app is still local-first.">
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => void handleExportJson()} variant="secondary">
                Export JSON
              </Button>
              <Button onClick={() => void handleExportCsv()} variant="secondary">
                Export CSV
              </Button>
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}

function downloadFile(fileName: string, content: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
