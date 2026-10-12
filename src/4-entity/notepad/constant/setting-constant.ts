import type { NotepadSettings, TabColor } from "../type";

export const TAB_COLORS: readonly TabColor[] = [
  "gray",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "indigo",
  "purple",
  "pink",
];

export const FONT_SCALES: readonly number[] = [0.8, 0.9, 1, 1.1, 1.2];

export const DEFAULT_SETTINGS: NotepadSettings = {
  fontScale: 1,
  tabColorCycle: ["gray", "green", "purple"],
  language: "en",
  panelSlide: false,
};
