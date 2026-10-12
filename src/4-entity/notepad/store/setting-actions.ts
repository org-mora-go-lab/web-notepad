import type { StateCreator } from "zustand";

import { LANGUAGES } from "@/src/5-shared/constant";

import { DEFAULT_SETTINGS, FONT_SCALES } from "../constant";
import type { NotepadState } from "../type";

type SettingActions = Pick<
  NotepadState,
  "setFontScale" | "setTabColorCycleColor" | "setLanguage" | "resetSettings" | "resetTabColorCycle"
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
      // Choosing a color used by another slot swaps the two so the cycle stays unique.
      const usedIndex = cycle.indexOf(color);
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
  resetSettings: () =>
    set({
      settings: { ...DEFAULT_SETTINGS, tabColorCycle: [...DEFAULT_SETTINGS.tabColorCycle] },
    }),
});
