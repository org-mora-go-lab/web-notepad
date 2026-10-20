import { PANE_IDS, type PaneId } from "@/src/4-entity/notepad";
import type { ViewPanel } from "@/src/5-shared";

import type { ViewSnapshot } from "../type";

type StoredView = {
  snapshot: ViewSnapshot;
};

const HISTORY_STATE_KEY = "__webNotepadView";
const PANEL_IDS: ViewPanel[] = [
  "bookmarks",
  "closed",
  "dashboard",
  "shortcuts",
  "global-search",
  "settings",
];

const isOptionalTabId = (value: unknown) =>
  value === undefined || value === null || typeof value === "string";

const isViewSnapshot = (value: unknown): value is ViewSnapshot => {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as Partial<ViewSnapshot>;
  return (
    typeof snapshot.groupId === "string" &&
    typeof snapshot.leftTabId === "string" &&
    isOptionalTabId(snapshot.rightTabId) &&
    isOptionalTabId(snapshot.leftBottomTabId) &&
    isOptionalTabId(snapshot.rightBottomTabId) &&
    PANE_IDS.includes(snapshot.pane as PaneId) &&
    (snapshot.groupMenuOpen === undefined || typeof snapshot.groupMenuOpen === "boolean") &&
    (snapshot.panel === null || PANEL_IDS.includes(snapshot.panel as ViewPanel))
  );
};

export const readStoredView = (state: unknown): StoredView | null => {
  if (!state || typeof state !== "object") return null;
  const storedView = (state as Record<string, unknown>)[HISTORY_STATE_KEY];
  if (!storedView || typeof storedView !== "object") return null;
  const candidate = storedView as Partial<StoredView>;
  // Entries saved before bottom panes existed have no bottom tab IDs.
  return isViewSnapshot(candidate.snapshot)
    ? {
        snapshot: {
          ...candidate.snapshot,
          rightTabId: candidate.snapshot.rightTabId ?? null,
          leftBottomTabId: candidate.snapshot.leftBottomTabId ?? null,
          rightBottomTabId: candidate.snapshot.rightBottomTabId ?? null,
        },
      }
    : null;
};

export const readViewFromUrl = (): ViewSnapshot | null => {
  const params = new URLSearchParams(window.location.search);
  const groupId = params.get("group");
  const leftTabId = params.get("leftTab");
  const rightTabId = params.get("rightTab");
  const leftBottomTabId = params.get("leftBottomTab");
  const rightBottomTabId = params.get("rightBottomTab");
  const pane = params.get("pane") as PaneId | null;
  const panelValue = params.get("panel");
  const panel =
    panelValue && PANEL_IDS.includes(panelValue as ViewPanel)
      ? (panelValue as ViewPanel)
      : null;

  if (!groupId || !leftTabId || !pane || !PANE_IDS.includes(pane)) {
    return null;
  }

  return {
    groupId,
    leftTabId,
    rightTabId,
    leftBottomTabId,
    rightBottomTabId,
    pane,
    panel,
    groupMenuOpen: params.get("groups") === "open" ? true : undefined,
  };
};

export const getViewHref = (snapshot: ViewSnapshot) => {
  const url = new URL(window.location.href);
  url.searchParams.set("group", snapshot.groupId);
  url.searchParams.set("leftTab", snapshot.leftTabId);
  const optionalParams = {
    rightTab: snapshot.rightTabId,
    leftBottomTab: snapshot.leftBottomTabId,
    rightBottomTab: snapshot.rightBottomTabId,
  };
  for (const [key, value] of Object.entries(optionalParams)) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  url.searchParams.set("pane", snapshot.pane);
  if (snapshot.panel) url.searchParams.set("panel", snapshot.panel);
  else url.searchParams.delete("panel");
  if (snapshot.groupMenuOpen) url.searchParams.set("groups", "open");
  else url.searchParams.delete("groups");
  return `${url.pathname}${url.search}${url.hash}`;
};

export const makeHistoryState = (snapshot: ViewSnapshot) => {
  const state = window.history.state;
  return {
    ...(state && typeof state === "object" ? state : {}),
    [HISTORY_STATE_KEY]: { snapshot } satisfies StoredView,
  };
};
