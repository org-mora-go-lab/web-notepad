"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/src/4-entity";
import { useI18n } from "@/src/5-shared/hook";

export function Theme() {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();

  return (
    <div className="theme">
      <div
        className="theme-label"
        role="menuitem"
        tabIndex={0}
      >
        {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
        <span>{t.theme}</span>
      </div>
      <label className="theme-toggle">
        <input
          type="checkbox"
          role="switch"
          aria-label={t.theme}
          checked={theme === "light"}
          onChange={(event) => setTheme(event.target.checked ? "light" : "dark")}
        />
        <span className="theme-toggle-track" aria-hidden="true" />
      </label>
    </div>
  );
}
