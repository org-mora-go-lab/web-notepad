"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/src/4-entity";
import { useI18n } from "@/src/5-shared/hook";

export function Theme() {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();

  return (
    <section className="theme setting-section">
      <h3 className="theme-label">
        {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
        <span>{t.theme}</span>
      </h3>
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
    </section>
  );
}
