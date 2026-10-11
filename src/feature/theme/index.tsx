"use client";

import { ChevronRight, Moon, Sun } from "lucide-react";
import { useId, useState } from "react";

import { useTheme } from "./hook/use-theme";

type Props = { onSelect: () => void };

export function Theme({ onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const optionsId = useId();
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme">
      <button type="button" role="menuitem" aria-expanded={open} aria-controls={optionsId}
        onClick={() => setOpen(!open)}>
        {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
        <span>THEME</span>
        <ChevronRight className={open ? "is-expanded" : ""} size={14} />
      </button>
      {open && (
        <div className="theme-options" id={optionsId} role="menu" aria-label="THEME">
          {(["dark", "light"] as const).map(option => (
            <button key={option} type="button" role="menuitemradio" aria-checked={theme === option}
              onClick={() => { setTheme(option); onSelect(); }}>
              {option === "dark" ? <Moon size={16} /> : <Sun size={16} />}
              <span>{option.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}