"use client";

import typingData from "@/src/data/typing";
import type { TypingConfig, TypingMode } from "@/types";
import s from "./speed.module.css";

interface ConfigBarProps {
  config: TypingConfig;
  onChange: (next: TypingConfig) => void;
}

export function ConfigBar({ config, onChange }: ConfigBarProps) {
  const values = typingData.options[config.mode];

  return (
    <div
      className={`${s.config} ${s.fade}`}
      role="toolbar"
      aria-label="Test settings"
    >
      <div className={s.group}>
        <button
          className={config.punct ? s.on : ""}
          aria-pressed={config.punct}
          onClick={(e) => {
            e.currentTarget.blur();
            onChange({ ...config, punct: !config.punct });
          }}
        >
          punctuation
        </button>
        <button
          className={config.nums ? s.on : ""}
          aria-pressed={config.nums}
          onClick={(e) => {
            e.currentTarget.blur();
            onChange({ ...config, nums: !config.nums });
          }}
        >
          numbers
        </button>
      </div>

      <span className={s.sep} aria-hidden="true" />

      <div className={s.group}>
        {(["time", "words"] as TypingMode[]).map((mode) => (
          <button
            key={mode}
            className={config.mode === mode ? s.on : ""}
            onClick={(e) => {
              e.currentTarget.blur();
              onChange({ ...config, mode });
            }}
          >
            {mode}
          </button>
        ))}
      </div>

      <span className={s.sep} aria-hidden="true" />

      <div className={s.group}>
        {values.map((value) => (
          <button
            key={value}
            className={config[config.mode] === value ? s.on : ""}
            onClick={(e) => {
              e.currentTarget.blur();
              onChange({ ...config, [config.mode]: value });
            }}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}
