import type { BookmarkEntry, ClosedTabEntry, NoteTab } from "../type";
import { sanitizeSelectedLines } from "../util";
import { normalizeTabColor } from "./read-value";
import { finiteNumberOr } from "./read-value";

export const normalizeTabs = (value: unknown, fallback: NoteTab[]): NoteTab[] =>
  (Array.isArray(value) ? value : fallback)
    .filter((tab) => tab && typeof tab.id === "string")
    .map((tab) => {
      const { urgent, ...tabData } = tab;
      const content = typeof tab.content === "string" ? tab.content : "";
      const selectedLines = sanitizeSelectedLines(tab.selectedLines, content);
      const tabColor = normalizeTabColor(tab.tabColor, urgent);

      return {
        ...tabData,
        title: typeof tab.title === "string" ? tab.title : "Untitled",
        content,
        selectedLines,
        savedContent:
          typeof tab.savedContent === "string" ? tab.savedContent : "",
        tabColor,
        pinned: Boolean(tab.pinned),
        bookmarked: Boolean(tab.bookmarked),
        restoredContent:
          typeof tab.restoredContent === "string"
            ? tab.restoredContent
            : undefined,
      };
    });

export const normalizeBookmarks = (value: unknown, fallback: BookmarkEntry[]) =>
  (Array.isArray(value) ? value : fallback)
    .filter((bookmark) => bookmark && typeof bookmark.id === "string")
    .map((bookmark) => {
      const content =
        typeof bookmark.content === "string" ? bookmark.content : "";
      return {
        ...bookmark,
        sourceTabId:
          typeof bookmark.sourceTabId === "string" ? bookmark.sourceTabId : "",
        title: typeof bookmark.title === "string" ? bookmark.title : "Untitled",
        content,
        tabColor: normalizeTabColor(bookmark.tabColor),
        selectedLines: sanitizeSelectedLines(bookmark.selectedLines, content),
        createdAt: finiteNumberOr(bookmark.createdAt, Date.now()),
        updatedAt: finiteNumberOr(
          bookmark.updatedAt,
          finiteNumberOr(bookmark.createdAt, Date.now()),
        ),
      };
    });

export const normalizeClosedTabs = (value: unknown): ClosedTabEntry[] =>
  (Array.isArray(value) ? value : []).flatMap((entry) => {
    if (
      !entry ||
      typeof entry.id !== "string" ||
      typeof entry.groupId !== "string"
    )
      return [];
    const [tab] = normalizeTabs([entry.tab], []);
    if (!tab) return [];
    return [
      {
        id: entry.id,
        groupId: entry.groupId,
        tab: { ...tab, pinned: false },
        closedAt: finiteNumberOr(entry.closedAt, Date.now()),
      },
    ];
  });
