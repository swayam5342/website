"use client";

import { useTheme, THEMES } from "@/src/hooks/useTheme";
import s from "./speed.module.css";

/** The site's theme picker, compacted to a select. Calling useTheme here
 *  also applies the saved theme, since the navbar is absent on this page. */
export function ThemeSelect() {
  const { theme, setTheme } = useTheme();

  return (
    <label className={`${s.themePicker} ${s.fade}`}>
      Theme
      <select
        value={theme}
        onChange={(e) => {
          setTheme(e.target.value as typeof theme);
          e.target.blur();
        }}
      >
        {THEMES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>
    </label>
  );
}
