import { popularTags, type Pop } from "@/lib/dummy-pops";

export const TAG_ROW = {
  maxItems: 6,
  maxTagLength: 7,
  maxChars: 28,
} as const;

export const TAG_ROW_COMPACT = {
  maxItems: 5,
  maxTagLength: 7,
  maxChars: 22,
} as const;

export function rankPopularTags(pops: Pop[]): string[] {
  const counts = new Map<string, number>();
  for (const tag of popularTags) counts.set(tag, 0);
  for (const pop of pops) {
    for (const tag of pop.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ja"))
    .map(([tag]) => tag);
}

export function tagsForOneRow(
  ranked: string[],
  selected: string[] = [],
  limits: { maxItems: number; maxTagLength: number; maxChars: number } = TAG_ROW,
) {
  const picked: string[] = [];
  let chars = 0;

  function consider(tag: string) {
    if (tag.length > limits.maxTagLength || picked.includes(tag)) return;
    if (picked.length >= limits.maxItems) return;
    if (chars + tag.length > limits.maxChars) return;
    picked.push(tag);
    chars += tag.length;
  }

  for (const tag of selected) consider(tag);
  for (const tag of ranked) consider(tag);
  if (picked.length === 0) {
    for (const tag of popularTags) consider(tag);
  }
  return picked;
}
