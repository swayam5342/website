"use client";

import { useEffect, useRef } from "react";
import type { TypingConfig, TypingResult, TypingSample } from "@/types";
import { ResultsChart } from "./ResultsChart";
import s from "./speed.module.css";

interface ResultsPanelProps {
  config: TypingConfig;
  result: TypingResult;
  samples: TypingSample[];
  personalBest: { text: string; isNew: boolean };
  onNext: () => void;
  onRepeat: () => void;
}

export function ResultsPanel({
  config,
  result,
  samples,
  personalBest,
  onNext,
  onRepeat,
}: ResultsPanelProps) {
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    nextRef.current?.focus({ preventScroll: true });
  }, []);

  const extras = [config.punct && "punctuation", config.nums && "numbers"].filter(
    Boolean
  );
  const { counts } = result;

  const stats = [
    {
      key: "test",
      value: `${config.mode} ${config[config.mode]}${extras.length ? `, ${extras.join(", ")}` : ""}`,
    },
    { key: "raw", value: String(Math.round(result.raw)) },
    {
      key: "characters",
      value: `${counts.correct}/${counts.incorrect}/${counts.extra}/${counts.missed}`,
      title: "correct / incorrect / extra / missed",
    },
    { key: "consistency", value: `${Math.round(result.consistency)}%` },
    {
      key: "time",
      value: `${config.mode === "time" ? config.time : result.elapsed.toFixed(1)}s`,
    },
  ];

  return (
    <section className={s.results} aria-live="polite">
      <div className={s.headline}>
        <div>
          <div className={s.bigKey}>wpm</div>
          <div className={s.bigValue}>{Math.round(result.wpm)}</div>
        </div>
        <div>
          <div className={s.bigKey}>accuracy</div>
          <div className={s.bigValue}>{Math.round(result.accuracy)}%</div>
        </div>
        <div className={`${s.pb} ${personalBest.isNew ? s.new : ""}`}>
          {personalBest.text}
        </div>
      </div>

      <ResultsChart samples={samples} />

      <div className={s.stats}>
        {stats.map((stat) => (
          <div key={stat.key} title={stat.title}>
            <div className={s.statKey}>{stat.key}</div>
            <div className={s.statValue}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className={s.actions}>
        <button ref={nextRef} onClick={onNext}>
          Next test
        </button>
        <button onClick={onRepeat}>Repeat test</button>
      </div>
    </section>
  );
}
