/**
 * Theme list, shared by server and client code. Kept out of the "use client"
 * hook so the root layout can inline the init script as a plain string.
 * To add or remove a theme: edit this list and its palette in theme.css.
 */

export type Theme = "stone" | "carbon" | "nord" | "tokyo" | "solarized" | "moss";

export interface ThemeInfo {
  id: Theme;
  label: string;
  mode: "dark" | "light";
  /** Swatch colours shown in the theme picker */
  swatch: { bg: string; accent: string };
}

export const THEMES: ThemeInfo[] = [
  { id: "stone", label: "Stone", mode: "light", swatch: { bg: "#dfdedb", accent: "#1f4dc4" } },
  { id: "carbon", label: "Carbon", mode: "dark", swatch: { bg: "#171715", accent: "#86a8ff" } },
  { id: "nord", label: "Nord", mode: "dark", swatch: { bg: "#2e3440", accent: "#88c0d0" } },
  { id: "tokyo", label: "Tokyo Storm", mode: "dark", swatch: { bg: "#24283b", accent: "#7aa2f7" } },
  { id: "solarized", label: "Solarized", mode: "dark", swatch: { bg: "#002b36", accent: "#e5b93a" } },
  { id: "moss", label: "Moss", mode: "dark", swatch: { bg: "#1f2a24", accent: "#c4de7a" } },
];

export const DEFAULT_THEME: Theme = "stone";

/**
 * A new key on purpose: older builds wrote a randomly picked theme to "theme"
 * for every visitor, so that value says nothing about what anyone chose.
 * Only a choice made with the switcher or the terminal is stored here.
 */
export const STORAGE_KEY = "site-theme";

export const isTheme = (value: unknown): value is Theme =>
  typeof value === "string" && THEMES.some((t) => t.id === value);

/** Runs before first paint (inlined in the root layout) so a saved theme never flashes. */
export const themeInitScript = `(function(){var d=document.documentElement;d.classList.add("js");try{var t=localStorage.getItem(${JSON.stringify(
  STORAGE_KEY
)});if(${JSON.stringify(THEMES.map((t) => t.id))}.indexOf(t)>-1){d.dataset.theme=t}}catch(e){}})();`;
