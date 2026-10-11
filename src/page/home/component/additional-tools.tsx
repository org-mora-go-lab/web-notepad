"use client";

import { ChevronRight, Keyboard, Menu, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useTheme } from "../hook/use-theme";

type Props = { onOpenShortcuts: () => void };

export function AdditionalTools({ onOpenShortcuts }: Props) {
  const [open, setOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { theme, setTheme } = useTheme();

  const close = () => {
    setOpen(false);
    setThemeOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    containerRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setOpen(false);
        setThemeOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div className="additional-tools" ref={containerRef}>
      <button
        className="additional-tools-trigger"
        ref={triggerRef}
        type="button"
        title="MENU"
        aria-label="MENU"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="additional-tools-menu"
        onClick={() => {
          setOpen(!open);
          setThemeOpen(false);
        }}
      >
        <Menu size={20} strokeWidth={1.8} />
        <span className="additional-tools-label">MENU</span>
      </button>
      {open && (
        <div
          className="additional-tools-menu"
          id="additional-tools-menu"
          role="menu"
          aria-label="MENU"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              event.stopPropagation();
              close();
            } else if (event.key === "Tab") {
              setOpen(false);
              setThemeOpen(false);
            } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
              event.preventDefault();
              const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>(
                '[role="menuitem"], [role="menuitemradio"]',
              )).filter(item => item.getClientRects().length > 0);
              const index = items.indexOf(document.activeElement as HTMLButtonElement);
              const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1
                : (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
              items[next]?.focus();
            }
          }}
        >
          <button type="button" role="menuitem" aria-expanded={themeOpen} aria-controls="theme-options"
            onClick={() => setThemeOpen(!themeOpen)}>
            {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
            <span>THEME</span>
            <ChevronRight className={themeOpen ? "is-expanded" : ""} size={14} />
          </button>
          {themeOpen && (
            <div className="theme-options" id="theme-options" role="menu" aria-label="THEME">
              {(["dark", "light"] as const).map(option => (
                <button key={option} type="button" role="menuitemradio" aria-checked={theme === option}
                  onClick={() => { setTheme(option); close(); }}>
                  {option === "dark" ? <Moon size={16} /> : <Sun size={16} />}
                  <span>{option.toUpperCase()}</span>
                </button>
              ))}
            </div>
          )}
          <button className="additional-tools-shortcut" type="button" role="menuitem"
            onClick={() => { setOpen(false); setThemeOpen(false); onOpenShortcuts(); }}>
            <Keyboard size={16} /><span>SHORTCUT</span>
          </button>
        </div>
      )}
    </div>
  );
}