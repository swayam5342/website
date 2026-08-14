"use client";

import type { FC, KeyboardEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import aboutData from "@/src/data/about";
import skillData from "@/src/data/skill";
import socialData from "@/src/data/social";
import projectsData from "@/src/data/projects";
import timelineData from "@/src/data/timeline";
import terminalData from "@/src/data/terminal";

type Line = { text: string; accent?: boolean; isCmd?: boolean };

const whoamiLine = () =>
  `${aboutData.name.toLowerCase()} :: ${aboutData.roles.join(" x ").toLowerCase()}`;

const BOOT_SCRIPT: { text: string; isCmd?: boolean }[] = [
  { text: "whoami", isCmd: true },
  { text: whoamiLine() },
  { text: "help", isCmd: true },
  { text: terminalData.bootHint },
];

const TYPE_SPEED_MS = terminalData.typeSpeedMs;
const LINE_PAUSE_MS = terminalData.linePauseMs;

const skillList = () =>
  Object.entries(skillData).map(
    ([group, items]) => `${group}: ${items.join(", ")}`
  );

const truncate = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

const projectList = () => {
  const shown = projectsData.slice(0, terminalData.projectsLimit);
  const lines = shown.map(
    (p) =>
      `${p.title.padEnd(20)} ${truncate(p.description, terminalData.projectDescriptionMaxChars)}`
  );
  const remaining = projectsData.length - shown.length;
  if (remaining > 0) lines.push(`… and ${remaining} more`);
  return lines;
};

const timelineList = () =>
  timelineData.map(
    (t) => `${t.date.padEnd(16)} ${t.title} @ ${t.subtitle}`
  );

function runCommand(raw: string, router: ReturnType<typeof useRouter>): string[] {
  const cmd = raw.trim().toLowerCase();

  switch (cmd) {
    case "":
      return [];
    case "help":
      return terminalData.helpLines;
    case "whoami":
      return [whoamiLine()];
    case "about":
      return [aboutData.main_text];
    case "skills":
      return skillList();
    case "projects":
      return [...projectList(), "", terminalData.projectsFooter];
    case "education":
    case "timeline":
      return timelineList();
    case "contact":
      return [
        `email      ${socialData.email}`,
        `github     ${socialData.github}`,
        `linkedin   ${socialData.linkedin}`,
        `blog       ${socialData.blog}`,
      ];
    case "resume":
      router.push("/resume");
      return [terminalData.resumeOpening];
    case "clear":
      return ["__CLEAR__"];
    case "sudo":
      return [terminalData.sudoResponse];
    default:
      return [terminalData.commandNotFound.replace("{cmd}", cmd)];
  }
}

/**
 * Boots with a short typed intro, then becomes a live prompt the
 * visitor can type real commands into (about/skills/projects/...).
 */
export const HeroTerminal: FC = () => {
  const router = useRouter();
  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const [history, setHistory] = useState<Line[]>([]);
  const [bootIndex, setBootIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [booted, setBooted] = useState(reducedMotion);
  const [input, setInput] = useState("");
  const [cmdLog, setCmdLog] = useState<string[]>([]);
  const [logPos, setLogPos] = useState(-1);
  const timer = useRef<number | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) {
      setHistory(
        BOOT_SCRIPT.map((l) => ({ text: l.text, isCmd: l.isCmd }))
      );
      setBooted(true);
      return;
    }

    if (bootIndex >= BOOT_SCRIPT.length) {
      setBooted(true);
      return;
    }

    const line = BOOT_SCRIPT[bootIndex];
    if (!line.isCmd) {
      timer.current = window.setTimeout(() => {
        setHistory((h) => [...h, { text: line.text }]);
        setBootIndex((i) => i + 1);
        setCharIndex(0);
      }, LINE_PAUSE_MS);
      return () => window.clearTimeout(timer.current);
    }

    if (charIndex < line.text.length) {
      timer.current = window.setTimeout(
        () => setCharIndex((c) => c + 1),
        TYPE_SPEED_MS
      );
    } else {
      timer.current = window.setTimeout(() => {
        setHistory((h) => [...h, { text: line.text, isCmd: true }]);
        setBootIndex((i) => i + 1);
        setCharIndex(0);
      }, LINE_PAUSE_MS);
    }

    return () => window.clearTimeout(timer.current);
  }, [bootIndex, charIndex, reducedMotion]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [history, booted]);

  const submit = () => {
    const value = input;
    setInput("");
    if (value.trim()) {
      setCmdLog((l) => [...l, value]);
    }
    setLogPos(-1);

    const output = runCommand(value, router);
    if (output[0] === "__CLEAR__") {
      setHistory([]);
      return;
    }

    setHistory((h) => [
      ...h,
      { text: value, isCmd: true },
      ...output.map((text) => ({ text })),
    ]);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdLog.length === 0) return;
      const next = logPos === -1 ? cmdLog.length - 1 : Math.max(0, logPos - 1);
      setLogPos(next);
      setInput(cmdLog[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (logPos === -1) return;
      const next = logPos + 1;
      if (next >= cmdLog.length) {
        setLogPos(-1);
        setInput("");
      } else {
        setLogPos(next);
        setInput(cmdLog[next]);
      }
    }
  };

  const currentBootLine =
    !booted && !reducedMotion ? BOOT_SCRIPT[bootIndex] : null;

  return (
    <div className="relative">
      {/* Soft accent glow behind the card */}
      <div className="absolute -inset-6 bg-brand-accent/10 blur-3xl" />

      <div
        className="relative border border-brand-border bg-brand-surface/80 backdrop-blur-sm"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-brand-border px-4 py-2.5">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-brand-accent" />
            <span className="w-2 h-2 bg-brand-border" />
            <span className="w-2 h-2 bg-brand-border" />
          </div>
          <span className="font-mono text-[9px] text-brand-muted tracking-widest uppercase">
            {terminalData.prompt}
          </span>
        </div>

        {/* Session */}
        <div
          ref={bodyRef}
          className="p-5 md:p-6 font-mono text-[11px] md:text-xs leading-relaxed min-h-[280px] max-h-[420px] overflow-y-auto"
        >
          {history.map((line, i) =>
            line.isCmd ? (
              <p key={i} className="text-brand-text mt-2 first:mt-0 whitespace-pre-wrap">
                <span className="text-brand-accent mr-2">$</span>
                {line.text}
              </p>
            ) : (
              <p
                key={i}
                className={
                  (line.accent ? "text-brand-accent" : "text-brand-muted") +
                  " whitespace-pre-wrap"
                }
              >
                {line.text}
              </p>
            )
          )}

          {currentBootLine?.isCmd && (
            <p className="text-brand-text mt-2 first:mt-0">
              <span className="text-brand-accent mr-2">$</span>
              {currentBootLine.text.slice(0, charIndex)}
              <span className="caret-blink inline-block w-[7px] h-[13px] bg-brand-accent align-middle ml-0.5" />
            </p>
          )}

          {booted && (
            <p className="text-brand-text mt-2 flex items-center">
              <span className="text-brand-accent mr-2 shrink-0">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                autoFocus
                spellCheck={false}
                autoComplete="off"
                aria-label="terminal input"
                className="flex-1 bg-transparent outline-none border-none text-brand-text font-mono text-[11px] md:text-xs caret-brand-accent"
              />
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
