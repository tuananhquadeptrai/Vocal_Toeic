"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { SectionCard } from "@/components/layout/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { appDb } from "@/lib/db/app-db";
import { ensureSeedData } from "@/lib/db/seed";

export function SettingsShell() {
  const [message, setMessage] = useState("");

  async function handleClearData() {
    await appDb.transaction("rw", appDb.vocabularyWords, appDb.quizSessions, appDb.quizAnswers, async () => {
      await appDb.quizAnswers.clear();
      await appDb.quizSessions.clear();
      await appDb.vocabularyWords.clear();
    });
    setMessage("Local data cleared.");
  }

  async function handleReseed() {
    await ensureSeedData();
    setMessage("Demo data is available.");
  }

  return (
    <AppShell currentPath="/settings">
      <div className="space-y-6">
        <PageHeader
          eyebrow="Settings"
          title="Keep local data manageable while the product is still in MVP mode."
          description="These utilities are intentionally simple: clear local storage tables, reseed demo data, and preserve an obvious place for future preferences."
          badge="Local-first controls"
        />

        <SectionCard title="Data tools" description="Use these actions carefully while testing flows.">
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => void handleReseed()} variant="secondary">
              Seed demo data
            </Button>
            <Button onClick={() => void handleClearData()} variant="destructive">
              Clear local data
            </Button>
            {message ? <Badge variant="success">{message}</Badge> : null}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
