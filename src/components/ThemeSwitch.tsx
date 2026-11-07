"use client";

import type { FC } from "react";
import { THEMES, useTheme } from "../hooks/useTheme";

/** A small extra: four swatches. The terminal's `theme` command does the same. */
export const ThemeSwitch: FC = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="theme-switch" role="group" aria-label="Colour theme">
      <span>Theme</span>
      <span className="theme-switch__opts">
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTheme(t.id)}
            aria-pressed={theme === t.id}
            aria-label={t.label}
            title={t.label}
          >
            <span style={{ background: t.swatch.bg }}>
              <i style={{ background: t.swatch.accent }} />
            </span>
          </button>
        ))}
      </span>
    </div>
  );
};
