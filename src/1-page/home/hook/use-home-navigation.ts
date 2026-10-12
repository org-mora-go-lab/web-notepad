"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  getActiveGroup,
  getPaneActiveTabId,
  getPaneTabs,
  PANE_IDS,
  type PaneId,
  useNotepadStore,
} from "@/src/4-entity/notepad";
import type { ViewPanel } from "@/src/5-shared";

import { useViewHistory, type ViewSnapshot } from "./use-view-history";

type Options = {
  hydrated: boolean;
  panelPinned: boolean;
  addTabToPane: (pane: PaneId) => void;
};

// Pinning only applies to the PC layout; mobile keeps the overlay drawer.
const isPinLayout = () => window.matchMedia("(min-width: 641px)").matches;

export function useHomeNavigation({ hydrated, panelPinned, addTabToPane }: Options) {
  const [openPanel, setOpenPanel] = useState<ViewPanel | null>(null);
  // A pinned panel stays open until its X button closes it.
  const keepsPanelOpen = useCallback(
    () => panelPinned && openPanel !== null && isPinLayout(),
    [openPanel, panelPinned],
  );
  const keepsPanelOpenRef = useRef(keepsPanelOpen);
  useEffect(() => {
    keepsPanelOpenRef.current = keepsPanelOpen;
  }, [keepsPanelOpen]);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const getCurrentView = useCallback((panel: ViewPanel | null = openPanel): ViewSnapshot => {
    const group = getActiveGroup(useNotepadStore.getState());
    return {
      groupId: group?.id ?? "",
      leftTabId: group?.activeTabId ?? "",
      rightTabId: group ? getPaneActiveTabId(group, "right") : null,
      leftBottomTabId: group ? getPaneActiveTabId(group, "left-bottom") : null,
      rightBottomTabId: group ? getPaneActiveTabId(group, "right-bottom") : null,
      pane: group?.activePane ?? "left",
      panel,
    };
  }, [openPanel]);

  const restoreView = useCallback((snapshot: ViewSnapshot) => {
    const state = useNotepadStore.getState();
    const targetGroup =
      state.groups.find((group) => group.id === snapshot.groupId) ?? state.groups[0];
    if (!targetGroup) return;

    state.selectGroup(targetGroup.id);
    const snapshotTabIds: Record<PaneId, string | null> = {
      left: snapshot.leftTabId,
      right: snapshot.rightTabId,
      "left-bottom": snapshot.leftBottomTabId,
      "right-bottom": snapshot.rightBottomTabId,
    };
    for (const pane of PANE_IDS) {
      const paneTabs = getPaneTabs(targetGroup, pane);
      const tab = paneTabs.find((item) => item.id === snapshotTabIds[pane]) ?? paneTabs[0];
      if (tab) state.selectTab(tab.id);
    }
    state.setActivePane(snapshot.pane);
    setOpenPanel((current) =>
      snapshot.panel === null && keepsPanelOpenRef.current() ? current : snapshot.panel,
    );
  }, []);

  const { pushView } = useViewHistory(
    hydrated,
    getCurrentView(null),
    restoreView,
  );

  const closeSidePanels = useCallback(() => {
    if (openPanel === null) return;
    setOpenPanel(null);
    pushView(getCurrentView(null));
  }, [getCurrentView, openPanel, pushView]);

  const toggleSidePanel = useCallback((panel: ViewPanel) => {
    if (openPanel === panel) {
      if (!keepsPanelOpen()) closeSidePanels();
      return;
    }
    setOpenPanel(panel);
    pushView(getCurrentView(panel));
  }, [closeSidePanels, getCurrentView, keepsPanelOpen, openPanel, pushView]);

  // Records a panel action; the panel closes unless it is pinned.
  const finishPanelAction = useCallback(() => {
    const panel = keepsPanelOpen() ? openPanel : null;
    setOpenPanel(panel);
    pushView(getCurrentView(panel));
  }, [getCurrentView, keepsPanelOpen, openPanel, pushView]);

  const selectTabWithHistory = useCallback((tabId: string) => {
    useNotepadStore.getState().selectTab(tabId);
    pushView(getCurrentView());
  }, [getCurrentView, pushView]);

  const activatePaneWithHistory = useCallback((pane: PaneId) => {
    const state = useNotepadStore.getState();
    const group = getActiveGroup(state);
    if (!group || group.activePane === pane) return;
    state.setActivePane(pane);
    pushView(getCurrentView());
  }, [getCurrentView, pushView]);

  const selectGroupAndClosePanel = useCallback((groupId: string) => {
    useNotepadStore.getState().selectGroup(groupId);
    finishPanelAction();
  }, [finishPanelAction]);

  const openBookmarkAndClosePanel = useCallback((groupId: string, bookmarkId: string) => {
    const state = useNotepadStore.getState();
    state.selectGroup(groupId);
    state.openBookmark(bookmarkId);
    finishPanelAction();
  }, [finishPanelAction]);

  const openBookmarkInCurrentGroupAndClosePanel = useCallback((bookmarkId: string) => {
    const state = useNotepadStore.getState();
    openBookmarkAndClosePanel(state.activeGroupId, bookmarkId);
  }, [openBookmarkAndClosePanel]);

  const restoreClosedTabAndClosePanel = useCallback((entryId: string) => {
    useNotepadStore.getState().restoreClosedTab(entryId);
    finishPanelAction();
  }, [finishPanelAction]);

  const addTabAndRecord = useCallback((pane: PaneId) => {
    addTabToPane(pane);
    pushView(getCurrentView());
  }, [addTabToPane, getCurrentView, pushView]);

  const moveTabToPaneAndRecord = useCallback((tabId: string, pane: PaneId) => {
    useNotepadStore.getState().moveTabToPane(tabId, pane);
    pushView(getCurrentView());
  }, [getCurrentView, pushView]);

  useEffect(() => {
    if (openPanel === null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== "Escape" || event.isComposing || event.defaultPrevented ||
        document.querySelector("dialog[open]")
      ) return;
      if (keepsPanelOpen()) return;
      event.preventDefault();
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      if (openPanel === "global-search") setGlobalSearchQuery("");
      closeSidePanels();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeSidePanels, keepsPanelOpen, openPanel]);

  return {
    openPanel,
    globalSearchQuery,
    setGlobalSearchQuery,
    closeSidePanels,
    toggleSidePanel,
    selectTabWithHistory,
    activatePaneWithHistory,
    selectGroupAndClosePanel,
    openBookmarkAndClosePanel,
    openBookmarkInCurrentGroupAndClosePanel,
    restoreClosedTabAndClosePanel,
    addTabAndRecord,
    moveTabToPaneAndRecord,
  };
}