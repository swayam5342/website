import { useEffect, useState } from "react";

export type Theme =
  | "default"
  | "matrix"
  | "neon"
  | "light"
  | "solarized"
  | "nord"
  | "dracula"
  | "notheme";

const STORAGE_KEY = "theme";

const THEME_ORDER: Theme[] = [
  "default",
  "matrix",
  "neon",
  "light",
  "solarized",
  "nord",
  "dracula",
  "notheme",
];

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    return saved && THEME_ORDER.includes(saved)
      ? saved
      : "solarized";
  });

  useEffect(() => {
    if (theme === "default") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }

    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const cycleTheme = () => {
    const next =
      THEME_ORDER[
        (THEME_ORDER.indexOf(theme) + 1) %
          THEME_ORDER.length
      ];
    setTheme(next);
  };

  const isLight = theme === "light";

  return {
    theme,
    setTheme,
    cycleTheme,
    isLight,
  };
}