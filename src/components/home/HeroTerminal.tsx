"use client";

import type { FC } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type ScriptLine =
  | { kind: "cmd"; text: string }
  | { kind: "out"; text: string; accent?: boolean };

const SCRIPT: ScriptLine[] = [
  { kind: "cmd", text: "whoami" },
  { kind: "out", text: "swayam :: backend x security" },
  { kind: "cmd", text: "scan --target api --top-ports" },
  { kind: "out", text: "8000/tcp  open   fastapi" },
  { kind: "out", text: "6379/tcp  open   redis" },
  { kind: "out", text: "5432/tcp  open   postgresql" },
  { kind: "cmd", text: "docker compose up -d" },
  { kind: "out", text: "[ok] 4 services healthy", accent: true },
  { kind: "cmd", text: "audit --scope auth --level strict" },
  { kind: "out", text: "0 critical / 0 high / hardened", accent: true },
];

const TYPE_SPEED_MS = 45;
const OUTPUT_DELAY_MS = 220;
const COMMAND_PAUSE_MS = 500;

/**
 * Types out a short, fictional audit session one line at a time,
 * then rests on a blinking prompt. Renders instantly when the
 * user prefers reduced motion.
 */
export const HeroTerminal: FC = () => {
  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const [lineIndex, setLineIndex] = useState(reducedMotion ? SCRIPT.length : 0);
  const [charIndex, setCharIndex] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (lineIndex >= SCRIPT.length) return;

    const line = SCRIPT[lineIndex];
    const advanceLine = () => {
      setLineIndex((i) => i + 1);
      setCharIndex(0);
    };

    if (line.kind === "out") {
      timer.current = window.setTimeout(advanceLine, OUTPUT_DELAY_MS);
    } else if (charIndex < line.text.length) {
      timer.current = window.setTimeout(
        () => setCharIndex((c) => c + 1),
        TYPE_SPEED_MS
      );
    } else {
      timer.current = window.setTimeout(advanceLine, COMMAND_PAUSE_MS);
    }

    return () => window.clearTimeout(timer.current);
  }, [lineIndex, charIndex]);

  const done = lineIndex >= SCRIPT.length;
  const finishedLines = SCRIPT.slice(0, lineIndex);
  const currentLine = done ? null : SCRIPT[lineIndex];

  return (
    <div className="relative" aria-hidden="true">
      {/* Soft accent glow behind the card */}
      <div className="absolute -inset-6 bg-brand-accent/10 blur-3xl" />

      <div className="relative border border-brand-border bg-brand-surface/80 backdrop-blur-sm">
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-brand-border px-4 py-2.5">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-brand-accent" />
            <span className="w-2 h-2 bg-brand-border" />
            <span className="w-2 h-2 bg-brand-border" />
          </div>
          <span className="font-mono text-[9px] text-brand-muted tracking-widest uppercase">
            swayam@sec:~/audit
          </span>
        </div>

        {/* Session */}
        <div className="p-5 md:p-6 font-mono text-[11px] md:text-xs leading-relaxed min-h-[280px]">
          {finishedLines.map((line, i) =>
            line.kind === "cmd" ? (
              <p key={i} className="text-brand-text mt-2 first:mt-0">
                <span className="text-brand-accent mr-2">$</span>
                {line.text}
              </p>
            ) : (
              <p
                key={i}
                className={line.accent ? "text-brand-accent" : "text-brand-muted"}
              >
                {line.text}
              </p>
            )
          )}

          {currentLine?.kind === "cmd" && (
            <p className="text-brand-text mt-2 first:mt-0">
              <span className="text-brand-accent mr-2">$</span>
              {currentLine.text.slice(0, charIndex)}
              <span className="caret-blink inline-block w-[7px] h-[13px] bg-brand-accent align-middle ml-0.5" />
            </p>
          )}

          {done && (
            <p className="text-brand-text mt-2">
              <span className="text-brand-accent mr-2">$</span>
              <span className="caret-blink inline-block w-[7px] h-[13px] bg-brand-accent align-middle" />
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
