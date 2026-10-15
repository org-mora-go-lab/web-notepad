import { LANGUAGES } from "@/src/5-shared/constant";
import type { Language } from "@/src/5-shared/type";

import {
  DASHBOARD_STATUSES,
  DEFAULT_SETTINGS,
  FONT_SCALES,
} from "../../constant";
import type { NotepadSettings, TabStatus } from "../../type";
import { isTabColor } from "../read-value";

export const normalizeSettings = (value: unknown): NotepadSettings => {
  const settings = (value && typeof value === "object" ? value : {}) as Partial<
    Record<keyof NotepadSettings, unknown>
  >;
  const cycle = settings.tabColorCycle;
  const validCycle =
    Array.isArray(cycle) &&
    cycle.length === DEFAULT_SETTINGS.tabColorCycle.length &&
    cycle.every(isTabColor) &&
    new Set(cycle).size === cycle.length;
  const sourceStatusNames =
    settings.dashboardStatusNames &&
    typeof settings.dashboardStatusNames === "object"
      ? (settings.dashboardStatusNames as Partial<Record<TabStatus, unknown>>)
      : {};
  const dashboardStatusNames = Object.fromEntries(
    DASHBOARD_STATUSES.flatMap((status) => {
      const name = sourceStatusNames[status];
      return typeof name === "string" && name.trim()
        ? [[status, name.trim().slice(0, 30)]]
        : [];
    }),
  ) as Partial<Record<TabStatus, string>>;
  return {
    fontScale: FONT_SCALES.includes(settings.fontScale as number)
      ? (settings.fontScale as number)
      : DEFAULT_SETTINGS.fontScale,
    tabColorCycle: validCycle
      ? [...cycle]
      : [...DEFAULT_SETTINGS.tabColorCycle],
    language: LANGUAGES.includes(settings.language as Language)
      ? (settings.language as Language)
      : DEFAULT_SETTINGS.language,
    panelPosition:
      settings.panelPosition === "left"
        ? "left"
        : DEFAULT_SETTINGS.panelPosition,
    panelSlide:
      typeof settings.panelSlide === "boolean"
        ? settings.panelSlide
        : DEFAULT_SETTINGS.panelSlide,
    dashboardStatusNames,
  };
};
