import { z } from "zod";

export const vocabularyFormSchema = z.object({
  word: z.string().trim().min(1, "Word is required"),
  meaningsInput: z.string().trim().min(1, "At least one meaning is required"),
  synonymsInput: z.string().trim(),
  example: z.string().trim(),
  topic: z.string().trim(),
});

export type VocabularyFormSchema = z.infer<typeof vocabularyFormSchema>;
