import type { HeroLine } from '@/components/home/HomePageClient';

export function parseHeroHeadingOverride(
  text: string | undefined | null,
): HeroLine[] | null {
  const t = text?.trim();
  if (!t) return null;
  const lines = t
    .split('\n')
    .map((line, i) => ({
      words: line.trim().split(/\s+/).filter(Boolean),
      emphasis: i === 0,
    }))
    .filter((line) => line.words.length > 0);
  return lines.length > 0 ? lines : null;
}
