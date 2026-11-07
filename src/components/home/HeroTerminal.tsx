"use client";

import type { FC, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import terminalData from "@/src/data/terminal";
import projectsData from "@/src/data/projects";
import { THEMES, applyTheme, isTheme } from "@/src/hooks/useTheme";
import type { TerminalCommand, TerminalLine, TerminalOutputLine } from "@/types";

/*
 * The site terminal. Commands, aliases and output all come from
 * src/data/terminal.json. It lives in the command palette (TerminalPalette),
 * so it works on every page and on phones.
 */

type Line = {
  text: string;
  isCmd?: boolean;
  accent?: boolean;
  bold?: boolean;
  dim?: boolean;
};

const TYPE_SPEED_MS = terminalData.typeSpeedMs;
const LINE_PAUSE_MS = terminalData.linePauseMs;

const normalizeLine = (line: TerminalLine): TerminalOutputLine =>
  typeof line === "string" ? { text: line } : line;

const renderLineText = (line: TerminalOutputLine) =>
  `${" ".repeat(line.indent ?? 0)}${line.prefix ? `${line.prefix} ` : ""}${line.text}`;

const toHistoryLine = (line: TerminalLine): Line => {
  const l = normalizeLine(line);
  return { text: renderLineText(l), accent: l.accent, bold: l.bold, dim: l.dim };
};

const truncate = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

const projectList = (command: TerminalCommand): string[] => {
  const visibleProjects = projectsData.filter((p) => p.show !== false);
  const shown = visibleProjects.slice(0, command.limit ?? visibleProjects.length);
  const lines = shown.map(
    (p) =>
      `${p.title.padEnd(command.titleWidth ?? 20)} ${truncate(
        p.description,
        command.descriptionMaxChars ?? 60
      )}`
  );
  const remaining = visibleProjects.length - shown.length;
  if (remaining > 0) lines.push(`… and ${remaining} more`);
  if (command.footer) lines.push("", command.footer);
  return lines;
};

/** `theme` lists the themes; `theme <name>` switches to one. */
const themeCommand = (arg: string | undefined): TerminalLine[] => {
  const current = document.documentElement.dataset.theme;
  if (!arg) {
    return [
      ...THEMES.map((t) => ({
        text: `${t.id === current ? "*" : " "} ${t.id.padEnd(12)}${t.label}${t.mode === "light" ? " (light)" : " (dark)"}`,
        accent: t.id === current,
      })),
      "",
      { text: "usage: theme <name>", dim: true },
    ];
  }
  const id = arg.toLowerCase();
  if (!isTheme(id)) return [`no theme called '${arg}' (try: ${THEMES.map((t) => t.id).join(", ")})`];
  applyTheme(id);
  return [{ text: `theme set to ${id}`, accent: true }];
};

// Every alias (and the canonical name itself) maps to its command entry.
const commandLookup: Record<string, TerminalCommand> = {};
for (const c of terminalData.commands) {
  commandLookup[c.name] = c;
  for (const alias of c.aliases ?? []) commandLookup[alias] = c;
}

const helpLines = () => [
  terminalData.helpHeader,
  ...terminalData.commands
    .filter((c) => !c.hidden)
    .map((c) => `  ${c.name.padEnd(terminalData.helpNameWidth)}- ${c.description}`),
];

function runCommand(
  raw: string,
  navigate: (href: string) => void
): TerminalLine[] {
  const [name, ...args] = raw.trim().split(/\s+/);
  const cmd = (name ?? "").toLowerCase();
  if (cmd === "") return [];

  if (cmd === "help") return helpLines();

  const command = commandLookup[cmd];
  if (!command) return [terminalData.commandNotFound.replace("{cmd}", cmd)];

  if (command.redirect) {
    navigate(command.redirect);
    return command.opening ? [command.opening] : [];
  }

  if (command.dynamic === "projects") return projectList(command);
  if (command.dynamic === "theme") return themeCommand(args[0]);

  return command.output ?? [];
}

const BOOT_SCRIPT: { text: string; isCmd?: boolean }[] = terminalData.bootCommands.flatMap((name) => [
  { text: name, isCmd: true },
  {
    text:
      name === "help"
        ? terminalData.bootHint
        : (commandLookup[name]?.output ?? []).map((l) => renderLineText(normalizeLine(l))).join("\n"),
  },
]);

/** Commands offered as buttons, for thumbs. */
const SUGGESTIONS = ["help", "about", "project", "skills", "theme", "contact"];

interface HeroTerminalProps {
  /** Called after a command opens another page, so the palette can close. */
  onNavigate?: () => void;
  /** Whether the terminal is on screen; it focuses its input when shown. */
  active?: boolean;
}

export const HeroTerminal: FC<HeroTerminalProps> = ({ onNavigate, active = true }) => {
  const router = useRouter();
  const [reducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
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

  const navigate = (href: string) => {
    window.setTimeout(() => {
      router.push(href);
      onNavigate?.();
    }, 250);
  };

  useEffect(() => {
    if (!active) return;
    if (reducedMotion) {
      setHistory(BOOT_SCRIPT.map((l) => ({ text: l.text, isCmd: l.isCmd })));
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
      timer.current = window.setTimeout(() => setCharIndex((c) => c + 1), TYPE_SPEED_MS);
    } else {
      timer.current = window.setTimeout(() => {
        setHistory((h) => [...h, { text: line.text, isCmd: true }]);
        setBootIndex((i) => i + 1);
        setCharIndex(0);
      }, LINE_PAUSE_MS);
    }

    return () => window.clearTimeout(timer.current);
  }, [bootIndex, charIndex, reducedMotion, active]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [history, booted]);

  useEffect(() => {
    if (active && booted) inputRef.current?.focus();
  }, [active, booted]);

  const execute = (value: string) => {
    if (value.trim()) setCmdLog((l) => [...l, value]);
    setLogPos(-1);

    const output = runCommand(value, navigate);
    if (output[0] === "__CLEAR__") {
      setHistory([]);
      return;
    }

    setHistory((h) => [...h, { text: value, isCmd: true }, ...output.map(toHistoryLine)]);
  };

  const submit = () => {
    const value = input;
    setInput("");
    execute(value);
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

  const currentBootLine = !booted && !reducedMotion ? BOOT_SCRIPT[bootIndex] : null;

  return (
    <div
      ref={bodyRef}
      className="term__body"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        inputRef.current?.focus();
      }}
    >
      <div role="log" aria-live="polite" aria-label="Terminal output">
      {history.map((line, i) =>
        line.isCmd ? (
          <p key={i} className="term__cmd">
            <span className="term__prompt" aria-hidden="true">
              $
            </span>
            {line.text}
          </p>
        ) : (
          <p
            key={i}
            className={[
              "term__out",
              line.accent ? "term__out--accent" : "",
              line.bold ? "term__out--bold" : "",
              line.dim ? "term__out--dim" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {line.text}
          </p>
        )
      )}
      </div>

      {currentBootLine?.isCmd && (
        <p className="term__cmd">
          <span className="term__prompt" aria-hidden="true">
            $
          </span>
          {currentBootLine.text.slice(0, charIndex)}
          <span
            className="caret-blink"
            style={{ display: "inline-block", width: 7, height: 14, background: "var(--code-accent)", verticalAlign: "middle", marginLeft: 2 }}
          />
        </p>
      )}

      {booted && (
        <>
          <p className="term__input-row">
            <label htmlFor="terminal-input" className="term__prompt">
              $<span className="sr-only">Command</span>
            </label>
            <input
              id="terminal-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              enterKeyHint="send"
              className="term__input"
            />
          </p>
          <div className="term__suggest" aria-label="Suggested commands">
            {SUGGESTIONS.filter((s) => s === "help" || commandLookup[s]).map((s) => (
              <button key={s} type="button" onClick={() => execute(s)}>
                {s}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
