"use client";

import { useCallback, useEffect, useRef } from "react";

import { PANE_IDS, type PaneId } from "@/src/4-entity/notepad";
import type { ViewPanel } from "@/src/5-shared";

export type ViewSnapshot = {
  groupId: string;
  leftTabId: string;
  rightTabId: string | null;
  leftBottomTabId: string | null;
  rightBottomTabId: string | null;
  pane: PaneId;
  panel: ViewPanel | null;
};

type StoredView = {
  snapshot: ViewSnapshot;
};

const HISTORY_STATE_KEY = "__webNotepadView";
const PANEL_IDS: ViewPanel[] = [
  "closed",
  "bookmarks",
  "groups",
  "shortcuts",
  "global-search",
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
    (snapshot.panel === null ||
      snapshot.panel === "closed" ||
      snapshot.panel === "bookmarks" ||
      snapshot.panel === "groups" ||
      snapshot.panel === "shortcuts" ||
      snapshot.panel === "global-search")
  );
};

const readStoredView = (state: unknown): StoredView | null => {
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

const readViewFromUrl = (): ViewSnapshot | null => {
  const params = new URLSearchParams(window.location.search);
  const groupId = params.get("group");
  const leftTabId = params.get("leftTab");
  const rightTabId = params.get("rightTab");
  const leftBottomTabId = params.get("leftBottomTab");
  const rightBottomTabId = params.get("rightBottomTab");
  const pane = params.get("pane") as PaneId | null;
  const panelValue = params.get("panel");
  const panel = panelValue && PANEL_IDS.includes(panelValue as ViewPanel)
    ? panelValue as ViewPanel
    : null;

  if (!groupId || !leftTabId || !pane || !PANE_IDS.includes(pane)) {
    return null;
  }

  return { groupId, leftTabId, rightTabId, leftBottomTabId, rightBottomTabId, pane, panel };
};

const getViewHref = (snapshot: ViewSnapshot) => {
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
  return `${url.pathname}${url.search}${url.hash}`;
};

const makeHistoryState = (snapshot: ViewSnapshot) => {
  const state = window.history.state;
  return {
    ...(state && typeof state === "object" ? state : {}),
    [HISTORY_STATE_KEY]: { snapshot } satisfies StoredView,
  };
};

export function useViewHistory(
  ready: boolean,
  initialSnapshot: ViewSnapshot,
  onRestore: (snapshot: ViewSnapshot) => void,
) {
  const initialized = useRef(false);
  const snapshotRef = useRef(initialSnapshot);
  const initialSnapshotRef = useRef(initialSnapshot);
  const restoreRef = useRef(onRestore);

  useEffect(() => {
    initialSnapshotRef.current = initialSnapshot;
    restoreRef.current = onRestore;
  }, [initialSnapshot, onRestore]);

  useEffect(() => {
    if (!ready || initialized.current) return;
    const storedView = readStoredView(window.history.state);
    const snapshot =
      readViewFromUrl() ?? storedView?.snapshot ?? initialSnapshotRef.current;
    snapshotRef.current = snapshot;
    restoreRef.current(snapshot);
    window.history.replaceState(
      makeHistoryState(snapshot),
      "",
      window.location.href,
    );
    initialized.current = true;
  }, [ready]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const snapshot = readStoredView(event.state)?.snapshot ?? readViewFromUrl();
      if (!snapshot) return;
      snapshotRef.current = snapshot;
      restoreRef.current(snapshot);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const pushView = useCallback((snapshot: ViewSnapshot) => {
    if (!initialized.current) return;
    if (JSON.stringify(snapshotRef.current) === JSON.stringify(snapshot)) return;
    window.history.pushState(
      makeHistoryState(snapshot),
      "",
      getViewHref(snapshot),
    );
    snapshotRef.current = snapshot;
  }, []);

  return { pushView };
}