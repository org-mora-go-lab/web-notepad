"use client";

import { useSyncExternalStore } from "react";

const PANEL_PIN_STORAGE_KEY = "web-notepad-panel-pinned";
const changeEvent = "notepad-panel-pin-change";

// Kept in memory too so pinning works when storage is unavailable.
let memoryPinned: boolean | null = null;

function currentPinned() {
  if (memoryPinned !== null) return memoryPinned;
  try {
    return localStorage.getItem(PANEL_PIN_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== PANEL_PIN_STORAGE_KEY && event.key !== null) return;
    memoryPinned = null;
    onChange();
  };
  window.addEventListener(changeEvent, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(changeEvent, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

// Remembers whether the right panel docks beside the workspace (PC only).
export function usePanelPin() {
  const panelPinned = useSyncExternalStore(
    subscribe,
    currentPinned,
    () => false,
  );
  const togglePanelPin = () => {
    memoryPinned = !panelPinned;
    try {
      localStorage.setItem(PANEL_PIN_STORAGE_KEY, String(memoryPinned));
      memoryPinned = null;
    } catch {
      // Storage is unavailable; keep the in-memory value.
    }
    window.dispatchEvent(new Event(changeEvent));
  };
  return { panelPinned, togglePanelPin };
}
