"use client";

import { Moon, Sun } from "lucide-react";
import { useId } from "react";

import { useTheme } from "@/src/4-entity";
import { useI18n } from "@/src/5-shared/hook";

import type { ThemeProps } from "./type";

export function Theme({ onSelect }: ThemeProps) {
  const optionsId = useId();
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
      <div
        className="theme-options"
        id={optionsId}
        role="radiogroup"
        aria-label={t.theme}
      >
        {(["dark", "light"] as const).map((option) => (
          <label
            key={option}
            className="theme-option"
          >
            <input
              type="radio"
              name={optionsId}
              value={option}
              aria-label={t[option]}
              checked={theme === option}
              onChange={() => {
                setTheme(option);
                onSelect();
              }}
            />
            <span aria-hidden="true">{t[option].slice(0, 1)}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
