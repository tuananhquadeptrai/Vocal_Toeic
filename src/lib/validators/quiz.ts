import { z } from "zod";

export const quizSetupSchema = z.object({
  mode: z.enum(["mixed", "meaning", "synonym", "wrong-only"]),
  topic: z.string(),
  questionCount: z.coerce.number().min(3).max(20),
});

export type QuizSetupSchema = z.infer<typeof quizSetupSchema>;
