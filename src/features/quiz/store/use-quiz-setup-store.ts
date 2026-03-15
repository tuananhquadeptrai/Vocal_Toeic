"use client";

import { create } from "zustand";
import type { QuizResultState, QuizSetup } from "@/lib/types";

interface QuizState {
  setup: QuizSetup;
  latestResult: QuizResultState | null;
  setSetup: (setup: QuizSetup) => void;
  setLatestResult: (result: QuizResultState | null) => void;
}

export const useQuizSetupStore = create<QuizState>((set) => ({
  setup: {
    mode: "mixed",
    topic: "",
    questionCount: 8,
  },
  latestResult: null,
  setSetup: (setup) => set({ setup }),
  setLatestResult: (latestResult) => set({ latestResult }),
}));
