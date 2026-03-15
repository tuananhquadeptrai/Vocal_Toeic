"use client";

import { useEffect } from "react";
import { ensureSeedData } from "@/lib/db/seed";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void ensureSeedData();
  }, []);

  return children;
}
