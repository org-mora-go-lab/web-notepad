import { DEFAULT_SETTINGS, TAB_STATUSES } from "../../constant";
import type { NoteTab, TabColor, TabStatus } from "../../type";

const graphemeSegmenter =
  typeof Intl.Segmenter === "function"
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;

const truncateGraphemes = (value: string, maximum: number) =>
  graphemeSegmenter
    ? Array.from(graphemeSegmenter.segment(value), ({ segment }) => segment)
        .slice(0, maximum)
        .join("")
    : Array.from(value).slice(0, maximum).join("");

export const createNoteTab = (
  number: number,
  tabColor: TabColor = DEFAULT_SETTINGS.tabColorCycle[0],
): NoteTab => ({
  id: `tab-${number}`,
  title: "-",
  content: "",
  savedContent: "",
  selectedLines: [],
  tabColor,
  pinned: false,
  bookmarked: false,
  updatedAt: 0,
});

export const getNextTabNumber = (
  tabs: NoteTab[],
  reservedIds: string[] = [],
  startAt = 2,
) => {
  const usedIds = new Set([...tabs.map((tab) => tab.id), ...reservedIds]);
  let number = startAt;
  while (usedIds.has(`tab-${number}`)) number += 1;
  return number;
};

// Keeps unique, in-range line indexes in ascending order.
export const sanitizeSelectedLines = (
  value: unknown,
  content: string,
): number[] => {
  if (!Array.isArray(value)) return [];
  const lineCount = content.split("\n").length;
  return [
    ...new Set(
      value.filter(
        (line: unknown): line is number =>
          typeof line === "number" &&
          Number.isInteger(line) &&
          line >= 0 &&
          line < lineCount,
      ),
    ),
  ].sort((first, second) => first - second);
};

export const getTitleFromContent = (content: unknown, fallback: string) => {
  const text = typeof content === "string" ? content : "";
  if (!text.trim()) return "-";

  const firstLine = text
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  return firstLine ? truncateGraphemes(firstLine, 28) : fallback;
};

// Todo / WIP / Done follow the position of the tab color in the cycle; colors outside it count as Todo.
export const getTabStatus = (
  tab: NoteTab,
  tabColorCycle: TabColor[],
): TabStatus =>
  TAB_STATUSES[Math.max(0, tabColorCycle.indexOf(tab.tabColor))] ?? "todo";

export const getStatusColor = (
  status: TabStatus,
  tabColorCycle: TabColor[],
): TabColor => tabColorCycle[TAB_STATUSES.indexOf(status)];
