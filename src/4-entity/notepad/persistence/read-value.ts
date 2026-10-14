import { TAB_COLORS } from "../constant";
import type { TabColor } from "../type";

export const isTabColor = (value: unknown): value is TabColor =>
  TAB_COLORS.includes(value as TabColor);

export const normalizeTabColor = (
  value: unknown,
  urgent?: unknown,
): TabColor =>
  isTabColor(value)
    ? value
    : value === "blue"
      ? "red"
      : urgent === false
        ? "gray"
        : "green";

export const finiteNumberOr = (value: unknown, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;
