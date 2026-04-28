import { useEffect, useState } from "react";

export type Theme =
  | "default"
  | "solarized"
  | "nord"
  | "notheme";

const STORAGE_KEY = "theme";

const THEME_ORDER: Theme[] = [
  "default",
  "solarized",
  "nord",
  "notheme",
];

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    return saved && THEME_ORDER.includes(saved)
      ? saved:"default";
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

  const isLight = theme === "default";

  return {
    theme,
    setTheme,
    cycleTheme,
    isLight,
  };
}