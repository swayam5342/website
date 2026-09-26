import typingData from "@/src/data/typing";
import type { TypingConfig } from "@/types";

const { generation: gen, words: WORDS } = typingData;

const SENTENCE_END = new RegExp(`[${gen.sentenceEnd.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}]$`);

const pick = <T>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

/**
 * Generates words one at a time so the stream can be extended mid-test.
 * Holds the two pieces of state that make the output read like prose:
 * the previous word (never repeated back to back) and whether the next
 * word starts a sentence.
 */
export class WordSource {
  private previous = "";
  private capitalizeNext = true;

  constructor(private readonly config: Pick<TypingConfig, "punct" | "nums">) {}

  reset() {
    this.previous = "";
    this.capitalizeNext = true;
  }

  next(): string {
    let word: string;

    if (this.config.nums && Math.random() < gen.numberChance) {
      const max = Math.random() < 0.5 ? gen.smallNumberMax : gen.largeNumberMax;
      word = String(Math.floor(Math.random() * max));
    } else {
      do {
        word = pick(WORDS);
      } while (word === this.previous);
      this.previous = word;
    }

    return this.config.punct ? this.punctuate(word) : word;
  }

  take(count: number): string[] {
    return Array.from({ length: count }, () => this.next());
  }

  private punctuate(word: string): string {
    let result = word;

    if (this.capitalizeNext && /^[a-z]/.test(result)) {
      result = result[0].toUpperCase() + result.slice(1);
    }

    const roll = Math.random();
    const rule = gen.punctuation.find((r) => roll < r.upTo);
    if (rule?.suffix) result += rule.suffix;
    else if (rule?.wrap) result = `${rule.wrap[0]}${result}${rule.wrap[1]}`;

    this.capitalizeNext = SENTENCE_END.test(result);
    return result;
  }
}

/** How many words to generate before the test starts. */
export const initialWordCount = (config: TypingConfig): number =>
  config.mode === "words" ? config.words : gen.timeModeWordCount;
