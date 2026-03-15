const SIMPLE_PUNCTUATION_REGEX = /[.,!?;:/()[\]{}"'`~\\_-]+/g;

export function normalizeAnswer(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(SIMPLE_PUNCTUATION_REGEX, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function splitListInput(value: string) {
  return value
    .split(/[|,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function dedupeNormalizedValues(values: string[]) {
  const seen = new Set<string>();
  const deduped: string[] = [];

  for (const value of values) {
    const normalized = normalizeAnswer(value);

    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    deduped.push(value.trim());
  }

  return deduped;
}

export function toTitleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
