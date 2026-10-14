import { createJSONStorage, type StateStorage } from "zustand/middleware";

const removeItem = (name: string) => {
  try {
    localStorage.removeItem(name);
  } catch {
    // The app can keep its in-memory state when browser storage is unavailable.
  }
};

export function createSafeJsonStorage<State>() {
  const storage: StateStorage = {
    getItem: (name) => {
      try {
        const value = localStorage.getItem(name);
        if (value !== null) JSON.parse(value);
        return value;
      } catch {
        removeItem(name);
        return null;
      }
    },
    setItem: (name, value) => {
      try {
        localStorage.setItem(name, value);
      } catch {
        // State updates still apply in memory when persistence is blocked.
      }
    },
    removeItem,
  };

  return createJSONStorage<State>(() => storage);
}
