"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_THEME, STORAGE_KEY, THEMES, isTheme, type Theme } from "../lib/themes";

export { THEMES, DEFAULT_THEME, isTheme };
export type { Theme, ThemeInfo } from "../lib/themes";

const listeners = new Set<() => void>();

const readTheme = (): Theme => {
  if (typeof document === "undefined") return DEFAULT_THEME;
  const attr = document.documentElement.dataset.theme;
  return isTheme(attr) ? attr : DEFAULT_THEME;
};

export const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Private mode or blocked storage: the theme still applies for this visit.
  }
  listeners.forEach((l) => l());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** One shared theme for the whole page: every caller sees the same value. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => DEFAULT_THEME);

  const cycleTheme = () => {
    const ids = THEMES.map((t) => t.id);
    applyTheme(ids[(ids.indexOf(theme) + 1) % ids.length]);
  };

  return {
    theme,
    setTheme: applyTheme,
    cycleTheme,
    isLight: THEMES.find((t) => t.id === theme)?.mode === "light",
  };
}
