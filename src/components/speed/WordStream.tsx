"use client";

import type { RefObject } from "react";
import { memo, useLayoutEffect, useRef } from "react";
import s from "./speed.module.css";

const Word = memo(function Word({
  target,
  typed,
  flagged,
}: {
  target: string;
  typed: string;
  flagged: boolean;
}) {
  const length = Math.max(target.length, typed.length);
  const letters = [];

  for (let j = 0; j < length; j++) {
    if (j < target.length) {
      const state = j < typed.length ? (typed[j] === target[j] ? s.ok : s.bad) : "";
      letters.push(
        <span key={j} className={state}>
          {target[j]}
        </span>
      );
    } else {
      letters.push(
        <span key={j} className={s.extra}>
          {typed[j]}
        </span>
      );
    }
  }

  return (
    <div className={`${s.word} ${flagged ? s.err : ""}`}>{letters}</div>
  );
});

interface WordStreamProps {
  words: string[];
  typed: string[];
  wordIndex: number;
  idle: boolean;
  blurred: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onFocus: () => void;
  onInput: (e: React.FormEvent<HTMLInputElement>) => void;
  onBlur: () => void;
}

/**
 * Renders the word stream and positions the caret against the live DOM.
 * The caret sits inside the scrolling container so it travels with the
 * text; the container shifts by whole lines to keep the cursor on line two.
 */
export function WordStream({
  words,
  typed,
  wordIndex,
  idle,
  blurred,
  inputRef,
  onFocus,
  onInput,
  onBlur,
}: WordStreamProps) {
  const wordsRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = wordsRef.current;
    const caret = caretRef.current;
    if (!container || !caret) return;

    const wordEl = container.children[
      Math.min(wordIndex, words.length - 1)
    ] as HTMLElement | undefined;
    if (!wordEl) return;

    const entered = (typed[wordIndex] ?? "").length;
    let x = wordEl.offsetLeft;
    if (entered > 0) {
      const letter = wordEl.children[entered - 1] as HTMLElement | undefined;
      if (letter) x += letter.offsetLeft + letter.offsetWidth;
    }

    caret.style.left = `${x - 1}px`;
    caret.style.top = `${wordEl.offsetTop + (wordEl.offsetHeight - caret.offsetHeight) / 2}px`;

    const lineHeight = (container.children[0] as HTMLElement)?.offsetHeight || 40;
    const line = Math.round(wordEl.offsetTop / lineHeight);
    container.style.transform = `translateY(${-Math.max(0, line - 1) * lineHeight}px)`;
  }, [wordIndex, typed, words]);

  return (
    <div
      className={`${s.wordsWrap} ${blurred ? s.blurred : ""}`}
      onClick={onFocus}
    >
      <input
        ref={inputRef}
        className={s.hiddenInput}
        type="text"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        aria-label="Type the words shown"
        defaultValue=" "
        onInput={onInput}
        onBlur={onBlur}
      />

      <div className={s.words} ref={wordsRef}>
        {words.map((word, i) => (
          <Word
            key={i}
            target={word}
            typed={typed[i] ?? ""}
            flagged={i < wordIndex && typed[i] !== word}
          />
        ))}
        <div ref={caretRef} className={`${s.caret} ${idle ? s.idle : ""}`} />
      </div>

      <div className={s.blurNote}>Click here or press any key to focus</div>
    </div>
  );
}
