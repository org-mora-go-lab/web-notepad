import type { StateCreator } from "zustand";

import { LANGUAGES } from "@/src/5-shared/constant";

import { DEFAULT_SETTINGS, FONT_SCALES, TAB_COLORS } from "../constant";
import type { NotepadState } from "../type";

type SettingActions = Pick<
  NotepadState,
  "setFontScale" | "setTabColorCycleColor" | "setLanguage" | "resetSettings" | "resetTabColorCycle" | "shuffleTabColorCycle"
>;

export const createSettingActions: StateCreator<
  NotepadState,
  [],
  [],
  SettingActions
> = (set) => ({
  setFontScale: (fontScale) =>
    set((state) =>
      FONT_SCALES.includes(fontScale)
        ? { settings: { ...state.settings, fontScale } }
        : state,
    ),
  setTabColorCycleColor: (index, color) =>
    set((state) => {
      const cycle = [...state.settings.tabColorCycle];
      if (index < 0 || index >= cycle.length) return state;
      // Earlier slots keep their colors; taking a later slot's color swaps the two so the cycle stays unique.
      const usedIndex = cycle.indexOf(color);
      if (usedIndex >= 0 && usedIndex < index) return state;
      if (usedIndex >= 0) cycle[usedIndex] = cycle[index];
      cycle[index] = color;
      return { settings: { ...state.settings, tabColorCycle: cycle } };
    }),
  setLanguage: (language) =>
    set((state) =>
      LANGUAGES.includes(language)
        ? { settings: { ...state.settings, language } }
        : state,
    ),
  resetTabColorCycle: () =>
    set((state) => ({
      settings: { ...state.settings, tabColorCycle: [...DEFAULT_SETTINGS.tabColorCycle] },
    })),
  // Picks distinct random colors for every slot, never repeating the current order.
  shuffleTabColorCycle: () =>
    set((state) => {
      const current = state.settings.tabColorCycle;
      let cycle = current;
      while (cycle.every((color, index) => color === current[index])) {
        const pool = [...TAB_COLORS];
        cycle = current.map(() => pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
      }
      return { settings: { ...state.settings, tabColorCycle: cycle } };
    }),
  resetSettings: () =>
    set({
      settings: { ...DEFAULT_SETTINGS, tabColorCycle: [...DEFAULT_SETTINGS.tabColorCycle] },
    }),
});
