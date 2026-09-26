import type { TypingCounts, TypingSample } from "@/types";

/** Standard net WPM: five characters count as one word. */
export const wpmOf = (chars: number, seconds: number): number =>
  seconds > 0 ? chars / 5 / (seconds / 60) : 0;
export function countCharacters(
  words: string[],
  typed: string[],
  wordIndex: number
): TypingCounts {
  let correct = 0;
  let incorrect = 0;
  let extra = 0;
  let missed = 0;
  let wordChars = 0;

  const last = Math.min(wordIndex, words.length - 1);

  for (let i = 0; i <= last; i++) {
    const target = words[i];
    const entry = typed[i] ?? "";

    for (let j = 0; j < Math.max(target.length, entry.length); j++) {
      if (j >= target.length) extra++;
      else if (j >= entry.length) {
        if (i < wordIndex) missed++;
      } else if (entry[j] === target[j]) correct++;
      else incorrect++;
    }

    if (i < wordIndex) {
      if (entry === target) wordChars += target.length + 1;
    } else if (target.startsWith(entry)) {
      wordChars += entry.length;
    }
  }

  return { correct, incorrect, extra, missed, wordChars };
}

/**
 * Consistency is how steady the raw speed was: 100% minus the coefficient
 * of variation across per-second samples. A flat run scores near 100.
 */
export function consistencyOf(samples: TypingSample[]): number {
  const raws = samples.map((s) => s.raw);
  if (raws.length === 0) return 0;

  const mean = raws.reduce((a, b) => a + b, 0) / raws.length;
  if (mean <= 0) return 0;

  const variance = raws.reduce((a, b) => a + (b - mean) ** 2, 0) / raws.length;
  return Math.max(0, 100 * (1 - Math.sqrt(variance) / mean));
}

/** Key for a personal best, so each mode and option set keeps its own. */
export const personalBestKey = (
  mode: string,
  value: number,
  punct: boolean,
  nums: boolean
): string => `${mode}-${value}-${+punct}-${+nums}`;
