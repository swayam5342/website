import { useEffect, useState } from "react";

export type Theme = "dark" | "light" | "nord" | "solarized";

export interface ThemeInfo {
  id: Theme;
  label: string;
  /** Swatch colors shown in the theme picker */
  swatch: { bg: string; accent: string };
}

/** To add or remove a theme: edit this list and its palette in theme.css. */
export const THEMES: ThemeInfo[] = [
  { id: "dark", label: "CARBON", swatch: { bg: "#0a0a0b", accent: "#4d94ff" } },
  { id: "light", label: "PAPER", swatch: { bg: "#fafaf9", accent: "#2563eb" } },
  { id: "nord", label: "NORD", swatch: { bg: "#2e3440", accent: "#88c0d0" } },
  {
    id: "solarized",
    label: "SOLARIZED",
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

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isTheme(saved)) return saved;
    if (saved && LEGACY_THEMES[saved]) return LEGACY_THEMES[saved];
    return "dark";
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
