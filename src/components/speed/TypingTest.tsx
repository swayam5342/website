"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import typingData from "@/src/data/typing";
import { WordSource, initialWordCount } from "@/src/lib/typing/words";
import {
  consistencyOf,
  countCharacters,
  personalBestKey,
  wpmOf,
} from "@/src/lib/typing/stats";
import { readStored, writeStored } from "@/src/lib/typing/storage";
import type { TypingConfig, TypingResult, TypingSample } from "@/types";
import { ConfigBar } from "./ConfigBar";
import { ResultsPanel } from "./ResultsPanel";
import { ThemeSelect } from "./ThemeSelect";
import { WordStream } from "./WordStream";
import s from "./speed.module.css";

const { generation: gen, storageKeys, personalBest: pbRules } = typingData;

/** Live test state. Held in a ref so keystrokes and the interval always
 *  see current values, with renders driven explicitly. */
interface LiveState {
  words: string[];
  typed: string[];
  wordIndex: number;
  started: boolean;
  done: boolean;
  startedAt: number;
  second: number;
  samples: TypingSample[];
  secondKeys: number;
  secondErrors: number;
  keys: number;
  goodKeys: number;
  lastSet: string[];
  liveWpm: number;
}

const emptyLive = (): LiveState => ({
  words: [],
  typed: [],
  wordIndex: 0,
  started: false,
  done: false,
  startedAt: 0,
  second: 0,
  samples: [],
  secondKeys: 0,
  secondErrors: 0,
  keys: 0,
  goodKeys: 0,
  lastSet: [],
  liveWpm: 0,
});

export function TypingTest() {
  const [config, setConfig] = useState<TypingConfig>(typingData.defaults);
  const [result, setResult] = useState<TypingResult | null>(null);
  const [personalBest, setPersonalBest] = useState({ text: "", isNew: false });
  const [blurred, setBlurred] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [typingActive, setTypingActive] = useState(false);
  const [, render] = useReducer((n: number) => n + 1, 0);

  const live = useRef<LiveState>(emptyLive());
  const configRef = useRef(config);
  const sourceRef = useRef<WordSource | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastMoveRef = useRef<[number, number] | null>(null);

  configRef.current = config;

  const focusInput = useCallback(() => {
    inputRef.current?.focus({ preventScroll: true });
    setBlurred(false);
  }, []);

  /* ---------- lifecycle ---------- */

  const startTest = useCallback(
    (repeat: boolean) => {
      const cfg = configRef.current;
      if (timerRef.current) clearInterval(timerRef.current);

      const source = new WordSource(cfg);
      sourceRef.current = source;

      const previous = live.current.lastSet;
      const words =
        repeat && previous.length > 0
          ? previous.slice()
          : source.take(initialWordCount(cfg));

      live.current = {
        ...emptyLive(),
        words,
        typed: words.map(() => ""),
        lastSet: words.slice(),
      };

      setResult(null);
      setPersonalBest({ text: "", isNew: false });
      setTypingActive(false);
      render();
      focusInput();
    },
    [focusInput],
  );

  const finish = useCallback(() => {
    const state = live.current;
    const cfg = configRef.current;
    if (state.done) return;

    state.done = true;
    if (timerRef.current) clearInterval(timerRef.current);

    const exact = (performance.now() - state.startedAt) / 1000;
    const elapsed = cfg.mode === "time" ? cfg.time : Math.max(exact, 0.5);
    const counts = countCharacters(state.words, state.typed, state.wordIndex);

    // Words mode rarely ends on a whole second; keep the final partial one.
    if (cfg.mode === "words" && elapsed - state.second > 0.15) {
      const part = elapsed - state.second;
      state.samples.push({
        second: Number(elapsed.toFixed(1)),
        wpm: wpmOf(counts.wordChars, elapsed),
        raw: state.secondKeys / 5 / (part / 60),
        errors: state.secondErrors,
      });
    }

    const wpm = wpmOf(counts.wordChars, elapsed);
    const accuracy = state.keys ? (state.goodKeys / state.keys) * 100 : 0;

    setResult({
      wpm,
      raw: state.keys / 5 / (elapsed / 60),
      accuracy,
      consistency: consistencyOf(state.samples),
      elapsed,
      counts,
    });

    // Personal bests are per mode and option set, this browser only.
    const key = personalBestKey(cfg.mode, cfg[cfg.mode], cfg.punct, cfg.nums);
    const bests = readStored<Record<string, number>>(
      storageKeys.personalBest,
      {},
    );
    const rounded = Math.round(wpm);

    if (
      rounded > 0 &&
      accuracy >= pbRules.minAccuracy &&
      rounded > (bests[key] ?? 0)
    ) {
      const hadPrevious = Boolean(bests[key]);
      bests[key] = rounded;
      writeStored(storageKeys.personalBest, bests);
      setPersonalBest({
        text: hadPrevious
          ? "New personal best"
          : "First result saved as your best",
        isNew: true,
      });
    } else {
      setPersonalBest({
        text: bests[key] ? `Your best here is ${bests[key]} wpm` : "",
        isNew: false,
      });
    }

    setTypingActive(false);
    render();
  }, []);

  const beginTiming = useCallback(() => {
    const state = live.current;
    state.started = true;
    state.startedAt = performance.now();

    timerRef.current = setInterval(() => {
      const s = live.current;
      const cfg = configRef.current;
      const elapsed = (performance.now() - s.startedAt) / 1000;

      while (!s.done && elapsed >= s.second + 1) {
        s.second++;
        const counts = countCharacters(s.words, s.typed, s.wordIndex);
        s.samples.push({
          second: s.second,
          wpm: wpmOf(counts.wordChars, s.second),
          raw: s.secondKeys * 12,
          errors: s.secondErrors,
        });
        s.secondKeys = 0;
        s.secondErrors = 0;
        s.liveWpm = wpmOf(counts.wordChars, s.second);
        render();
        if (cfg.mode === "time" && s.second >= cfg.time) finish();
      }
    }, 50);

    render();
  }, [finish]);

  /* ---------- input ---------- */

  const onCharacter = useCallback(
    (char: string) => {
      const state = live.current;
      const cfg = configRef.current;
      if (state.done) return;

      if (char === " ") {
        if (!state.started || state.typed[state.wordIndex] === "") return;
        setTypingActive(true);
        state.keys++;
        state.secondKeys++;
        if (state.typed[state.wordIndex] === state.words[state.wordIndex])
          state.goodKeys++;
        else state.secondErrors++;
        state.wordIndex++;

        if (cfg.mode === "words") {
          if (state.wordIndex >= state.words.length) {
            finish();
            return;
          }
        } else if (state.wordIndex > state.words.length - gen.refillThreshold) {
          const extra = sourceRef.current?.take(gen.refillCount) ?? [];
          state.words = [...state.words, ...extra];
          state.typed = [...state.typed, ...extra.map(() => "")];
        }

        render();
        return;
      }

      if (!state.started) beginTiming();
      setTypingActive(true);

      const entry = state.typed[state.wordIndex];
      const target = state.words[state.wordIndex];
      if (entry.length >= target.length + gen.maxOvertype) return;

      state.keys++;
      state.secondKeys++;
      if (entry.length < target.length && target[entry.length] === char)
        state.goodKeys++;
      else state.secondErrors++;

      state.typed = state.typed.map((t, i) =>
        i === state.wordIndex ? entry + char : t,
      );

      if (
        cfg.mode === "words" &&
        state.wordIndex === state.words.length - 1 &&
        state.typed[state.wordIndex] === state.words[state.wordIndex]
      ) {
        finish();
        return;
      }

      render();
    },
    [beginTiming, finish],
  );

  const onBackspace = useCallback((wordWise: boolean) => {
    const state = live.current;
    if (state.done || !state.started) return;

    if (state.typed[state.wordIndex].length) {
      const current = state.typed[state.wordIndex];
      const next = wordWise ? "" : current.slice(0, -1);
      state.typed = state.typed.map((t, i) =>
        i === state.wordIndex ? next : t,
      );
    } else if (
      state.wordIndex > 0 &&
      state.typed[state.wordIndex - 1] !== state.words[state.wordIndex - 1]
    ) {
      state.wordIndex--;
      if (wordWise) {
        state.typed = state.typed.map((t, i) =>
          i === state.wordIndex ? "" : t,
        );
      }
    } else {
      return;
    }

    render();
  }, []);

  /* ---------- effects ---------- */

  // Restore the saved config once, on the client only.
  useEffect(() => {
    const saved = readStored<Partial<TypingConfig>>(storageKeys.config, {});
    setConfig((current) => ({ ...current, ...saved }));
  }, []);

  // New config means a new test.
  useEffect(() => {
    writeStored(storageKeys.config, config);
    startTest(false);
  }, [config, startTest]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "SELECT") return;
      if (typeof e.getModifierState === "function") {
        setCapsOn(e.getModifierState("CapsLock"));
      }

      if (e.key === "Tab" || e.key === "Escape") {
        e.preventDefault();
        startTest(false);
        return;
      }

      // On the results screen, Enter on the focused button works normally.
      if (live.current.done) return;

      if (e.key === "Backspace") {
        e.preventDefault();
        onBackspace(e.ctrlKey || e.altKey || e.metaKey);
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key.length === 1) {
        e.preventDefault();
        if (document.activeElement !== inputRef.current) focusInput();
        onCharacter(e.key);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [focusInput, onBackspace, onCharacter, startTest]);

  // Moving the mouse brings the chrome back.
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const last = lastMoveRef.current;
      if (last && Math.hypot(e.clientX - last[0], e.clientY - last[1]) > 4) {
        setTypingActive(false);
      }
      lastMoveRef.current = [e.clientX, e.clientY];
    };
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  /* ---------- render ---------- */

  const state = live.current;
  const showResults = Boolean(result);

  const counter =
    config.mode === "time"
      ? String(Math.max(0, config.time - state.second))
      : `${Math.min(state.wordIndex, state.words.length)}/${state.words.length}`;

  return (
    <div
      className={`${s.page} ${typingActive ? s.typing : ""} ${state.started && !showResults ? s.started : ""}`}
    >
      <div className={s.app}>
        <header className={s.header}>
          <a
            className={s.logo}
            href="/"
            aria-label={`${typingData.brand} home`}
          >
            {typingData.brand}
            <span className={s.bar} aria-hidden="true" />
          </a>
          <ThemeSelect />
        </header>

        <main className={s.main}>
          {showResults && result ? (
            <ResultsPanel
              config={config}
              result={result}
              samples={state.samples}
              personalBest={personalBest}
              onNext={() => startTest(false)}
              onRepeat={() => startTest(true)}
            />
          ) : (
            <>
              <ConfigBar config={config} onChange={setConfig} />

              <section className={s.test}>
                {capsOn && <div className={s.caps}>Caps Lock is on</div>}

                <div className={s.live} aria-live="off">
                  <span>{counter}</span>
                  <span className={s.liveWpm}>
                    {Math.round(state.liveWpm)} wpm
                  </span>
                </div>

                <WordStream
                  words={state.words}
                  typed={state.typed}
                  wordIndex={state.wordIndex}
                  idle={!state.started}
                  blurred={blurred}
                  inputRef={inputRef}
                  onFocus={focusInput}
                  onInput={(e) => {
                    const native = e.nativeEvent as InputEvent;
                    if (native.inputType === "deleteContentBackward")
                      onBackspace(false);
                    else if (native.inputType === "deleteWordBackward")
                      onBackspace(true);
                    else if (native.data) {
                      for (const ch of native.data) onCharacter(ch);
                    }
                    e.currentTarget.value = " ";
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      if (
                        document.activeElement !== inputRef.current &&
                        !live.current.done &&
                        window.matchMedia("(pointer: coarse)").matches
                      ) {
                        setBlurred(true);
                      }
                    }, 0);
                  }}
                />

                <button
                  className={s.restart}
                  aria-label="Restart test"
                  title="Restart test"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    startTest(false);
                  }}
                >
                  <RotateCcw size={20} />
                </button>
              </section>
            </>
          )}
        </main>

        <footer className={`${s.footer} ${s.fade}`}>
          {typingData.hints.map((hint) => (
            <span key={hint.label} className={hint.desktopOnly ? s.desk : ""}>
              {hint.keys.map((k) => (
                <kbd key={k}>{k}</kbd>
              ))}
              {hint.alt?.map((k) => (
                <span key={k}>
                  or <kbd>{k}</kbd>
                </span>
              ))}
              {hint.label}
            </span>
          ))}
        </footer>
      </div>
    </div>
  );
}
