"use client";

import { useSyncExternalStore } from "react";

import { THEME_STORAGE_KEY } from "../constant";

type Theme = "dark" | "light";
const changeEvent = "notepad-theme-change";

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
    document.documentElement.dataset.theme = event.newValue === "light" ? "light" : "dark";
    onChange();
  };
  window.addEventListener(changeEvent, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(changeEvent, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, currentTheme, () => "dark" as Theme);
  const setTheme = (nextTheme: Theme) => {
    document.documentElement.dataset.theme = nextTheme;
    window.dispatchEvent(new Event(changeEvent));
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      return;
    }
  };
  return { theme, setTheme };
}