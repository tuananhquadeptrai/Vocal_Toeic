"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { SectionCard } from "@/components/layout/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { appDb } from "@/lib/db/app-db";
import type { VocabularyWord } from "@/lib/types";
import { normalizeAnswer } from "@/lib/utils/text";
import { useVocabularyFilters } from "../store/use-vocabulary-filters";

const statusTone: Record<VocabularyWord["status"], "accent" | "warning" | "success" | "danger"> = {
  new: "accent",
  learning: "warning",
  reviewed: "success",
  weak: "danger",
};

export function VocabularyListShell() {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const { search, topic, setSearch, setTopic } = useVocabularyFilters();

  useEffect(() => {
    let isMounted = true;

    async function loadWords() {
      const nextWords = await appDb.vocabularyWords.orderBy("createdAt").reverse().toArray();

      if (isMounted) {
        setWords(nextWords);
      }
    }

    void loadWords();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredWords = useMemo(() => {
    const normalizedSearch = normalizeAnswer(search);

    return words.filter((word) => {
      const haystack = [
        word.word,
        ...word.meanings,
        ...word.synonyms,
        word.topic || "",
      ]
        .map(normalizeAnswer)
        .join(" ");

      const matchesSearch = !normalizedSearch || haystack.includes(normalizedSearch);
      const matchesTopic = !topic || word.topic === topic;

      return matchesSearch && matchesTopic;
    });
  }, [search, topic, words]);

  const topics = useMemo(
    () =>
      Array.from(
        new Set(words.map((word) => word.topic).filter((item): item is string => Boolean(item))),
      ).sort(),
    [words],
  );

  async function handleDelete(id: string) {
    await appDb.vocabularyWords.delete(id);
    const nextWords = await appDb.vocabularyWords.orderBy("createdAt").reverse().toArray();
    setWords(nextWords);
  }

  return (
    <AppShell currentPath="/vocabulary">
      <div className="space-y-6">
        <PageHeader
          eyebrow="Vocabulary"
          title="Manage your own word bank before turning it into daily quiz reps."
          description="This screen already wires local persistence, search, topic filtering, and quick edit actions. It is a good base to add import, tags, and batch actions next."
          badge={`${filteredWords.length} visible`}
        />

        <SectionCard title="Filters" description="Search across word, meaning, synonym, and topic.">
          <div className="grid gap-4 md:grid-cols-[1.4fr_0.8fr_auto]">
            <Input
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by word, meaning, synonym..."
              value={search}
            />
            <Select onValueChange={(value) => setTopic(value === "all" ? "" : value)} value={topic || "all"}>
              <SelectTrigger>
                <SelectValue placeholder="All topics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All topics</SelectItem>
                {topics.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button asChild>
              <Link href="/vocabulary/new">Add word</Link>
            </Button>
          </div>
        </SectionCard>

        {filteredWords.length === 0 ? (
          <EmptyState
            actionHref="/vocabulary/new"
            actionLabel="Add first word"
            description="There are no vocabulary items matching the current filter. Start with a few words or clear your filters."
            title="No vocabulary found"
          />
        ) : (
          <div className="grid gap-4">
            {filteredWords.map((word) => (
              <SectionCard
                description={word.example || "No example added yet."}
                key={word.id}
                title={word.word}
              >
                <div className="flex flex-wrap gap-2">
                  <Badge variant={statusTone[word.status]}>{word.status}</Badge>
                  {word.topic ? <Badge variant="outline">{word.topic}</Badge> : null}
                  <Badge variant="success">{word.meanings.length} meanings</Badge>
                  <Badge variant="accent">{word.synonyms.length} synonyms</Badge>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Meanings
                    </p>
                    <p className="mt-2 text-sm leading-7">{word.meanings.join(", ")}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Synonyms
                    </p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {word.synonyms.length > 0 ? word.synonyms.join(", ") : "No synonyms yet"}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button asChild variant="secondary">
                    <Link href={`/vocabulary/${word.id}/edit`}>Edit</Link>
                  </Button>
                  <Button onClick={() => void handleDelete(word.id)} variant="ghost">
                    Delete
                  </Button>
                </div>
              </SectionCard>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
