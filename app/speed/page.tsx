import type { Metadata } from "next";
import typingData from "@/src/data/typing";
import { TypingTest } from "@/src/components/speed/TypingTest";

export const metadata: Metadata = {
  title: `${typingData.brand}, ${typingData.tagline}`,
  description: typingData.description,
  // Unlisted on purpose: found through the terminal, not through search.
  robots: { index: false, follow: false },
};

export default function Speed() {
  return <TypingTest />;
}
