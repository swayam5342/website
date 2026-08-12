"use client";

import { useEffect, useState } from "react";

export type Theme =
  | "dark"
  | "light"
  | "ayu-light"
  | "catppuccin-latte"
  | "github-light"
  | "tokyo-night-storm"
  | "catppuccin-mocha"
  | "gruvbox-dark"
  | "nord"
  | "solarized";

export interface ThemeInfo {
  id: Theme;
  label: string;
  /** OS color-scheme this theme belongs to, used to auto-pick a theme on first visit */
  mode: "dark" | "light";
  /** Swatch colors shown in the theme picker */
  swatch: { bg: string; accent: string };
}

/** To add or remove a theme: edit this list and its palette in theme.css. */
export const THEMES: ThemeInfo[] = [
  { id: "dark", label: "CARBON", mode: "dark", swatch: { bg: "#0a0a0b", accent: "#4d94ff" } },
  { id: "light", label: "PAPER", mode: "light", swatch: { bg: "#fafaf9", accent: "#2563eb" } },
  {
    id: "ayu-light",
    label: "AYU_LIGHT",
    mode: "light",
    swatch: { bg: "#fafafa", accent: "#fa8d3e" },
  },
  {
    id: "catppuccin-latte",
    label: "LATTE",
    mode: "light",
    swatch: { bg: "#eff1f5", accent: "#1e66f5" },
  },
  {
    id: "github-light",
    label: "GITHUB_LIGHT",
    mode: "light",
    swatch: { bg: "#ffffff", accent: "#0969da" },
  },
  {
    id: "tokyo-night-storm",
    label: "TOKYO_STORM",
    mode: "dark",
    swatch: { bg: "#24283b", accent: "#7aa2f7" },
  },
  {
    id: "catppuccin-mocha",
    label: "MOCHA",
    mode: "dark",
    swatch: { bg: "#1e1e2e", accent: "#cba6f7" },
  },
  {
    id: "gruvbox-dark",
    label: "GRUVBOX",
    mode: "dark",
    swatch: { bg: "#1d2021", accent: "#83a598" },
  },
  { id: "nord", label: "NORD", mode: "dark", swatch: { bg: "#2e3440", accent: "#88c0d0" } },
  {
    id: "solarized",
    label: "SOLARIZED",
    mode: "dark",
    swatch: { bg: "#002b36", accent: "#d4a017" },
  },
];

const STORAGE_KEY = "theme";

/** Values written by older builds map onto the current theme set. */
const LEGACY_THEMES: Record<string, Theme> = {
  default: "light",
  notheme: "light",
  neon: "dark",
  dracula: "dark",
};

const isTheme = (value: string): value is Theme =>
  THEMES.some((t) => t.id === value);

/** No saved preference yet: match the OS color scheme and pick a random theme for it. */
const pickThemeForDevice = (): Theme => {
  const prefersLight =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: light)").matches;
  const mode = prefersLight ? "light" : "dark";
  const candidates = THEMES.filter((t) => t.mode === mode);
  const pool = candidates.length > 0 ? candidates : THEMES;
  return pool[Math.floor(Math.random() * pool.length)].id;
};

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isTheme(saved)) return saved;
    if (saved && LEGACY_THEMES[saved]) return LEGACY_THEMES[saved];
    return pickThemeForDevice();
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }

    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const cycleTheme = () => {
    const ids = THEMES.map((t) => t.id);
    setTheme(ids[(ids.indexOf(theme) + 1) % ids.length]);
  };

  const isLight = theme === "light";

  return {
    theme,
    setTheme,
    cycleTheme,
    isLight,
  };
}
