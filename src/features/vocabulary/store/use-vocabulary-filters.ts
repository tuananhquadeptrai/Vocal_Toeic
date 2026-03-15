"use client";

import { create } from "zustand";

interface VocabularyFilterState {
  search: string;
  topic: string;
  setSearch: (search: string) => void;
  setTopic: (topic: string) => void;
  reset: () => void;
}

export const useVocabularyFilters = create<VocabularyFilterState>((set) => ({
  search: "",
  topic: "",
  setSearch: (search) => set({ search }),
  setTopic: (topic) => set({ topic }),
  reset: () => set({ search: "", topic: "" }),
}));
