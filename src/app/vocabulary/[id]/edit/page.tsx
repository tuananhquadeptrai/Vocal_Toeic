import { VocabularyFormShell } from "@/features/vocabulary/components/vocabulary-form-shell";

export default async function EditVocabularyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <VocabularyFormShell currentPath="/vocabulary" mode="edit" wordId={id} />;
}
