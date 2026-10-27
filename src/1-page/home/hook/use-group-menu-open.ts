"use client";

import { useCallback, useSyncExternalStore } from "react";

const GROUP_MENU_OPEN_STORAGE_KEY = "web-notepad-group-sidebar-open";
const GROUP_MENU_OPEN_EVENT = "web-notepad-group-sidebar-open-change";
let groupMenuOpenFallback = false;

const readGroupMenuOpen = () => {
  try {
    return localStorage.getItem(GROUP_MENU_OPEN_STORAGE_KEY) === "true";
  } catch {
    return groupMenuOpenFallback;
  }
};

const subscribeGroupMenuOpen = (onStoreChange: () => void) => {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === GROUP_MENU_OPEN_STORAGE_KEY) onStoreChange();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(GROUP_MENU_OPEN_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(GROUP_MENU_OPEN_EVENT, onStoreChange);
  };
};

export function useGroupMenuOpen() {
  const groupMenuOpen = useSyncExternalStore(
    subscribeGroupMenuOpen,
    readGroupMenuOpen,
    () => false,
  );

  const updateGroupMenuOpen = useCallback((open: boolean) => {
    groupMenuOpenFallback = open;
    try {
      localStorage.setItem(GROUP_MENU_OPEN_STORAGE_KEY, String(open));
    } catch {
      // Browser storage is required only for restoring the state after refresh.
    }
    window.dispatchEvent(new Event(GROUP_MENU_OPEN_EVENT));
  }, []);

  return {
    groupMenuOpen,
    updateGroupMenuOpen,
    getGroupMenuOpen: readGroupMenuOpen,
  };
}
