"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  ALL_GROUP_ID,
  getActiveGroup,
  getPaneActiveTabId,
  getPaneTabs,
  PANE_IDS,
  type PaneId,
  useNotepadStore,
} from "@/src/4-entity/notepad";
import type { ViewPanel } from "@/src/5-shared";

import type { ViewSnapshot } from "../../type";
import { useViewActions } from "./use-view-actions";
import { useViewHistory } from "./use-view-history";

type Options = {
  hydrated: boolean;
  panelPinned: boolean;
  addTabToPane: (pane: PaneId) => void;
};

// Pinning only applies to the PC layout; mobile keeps the overlay drawer.
const isPinLayout = () => window.matchMedia("(min-width: 641px)").matches;

export function useHomeNavigation({
  hydrated,
  panelPinned,
  addTabToPane,
}: Options) {
  const [openPanel, setOpenPanel] = useState<ViewPanel | null>(null);
  // A pinned panel stays open until its X button closes it.
  const keepsPanelOpen = useCallback(
    () =>
      panelPinned &&
      openPanel !== null &&
      openPanel !== "global-search" &&
      openPanel !== "closed" &&
      isPinLayout(),
    [openPanel, panelPinned],
  );
  const keepsPanelOpenRef = useRef(keepsPanelOpen);
  useEffect(() => {
    keepsPanelOpenRef.current = keepsPanelOpen;
  }, [keepsPanelOpen]);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const getCurrentView = useCallback(
    (panel: ViewPanel | null = openPanel): ViewSnapshot => {
      const group = getActiveGroup(useNotepadStore.getState());
      return {
        groupId: group?.id ?? "",
        leftTabId: group?.activeTabId ?? "",
        rightTabId: group ? getPaneActiveTabId(group, "right") : null,
        leftBottomTabId: group
          ? getPaneActiveTabId(group, "left-bottom")
          : null,
        rightBottomTabId: group
          ? getPaneActiveTabId(group, "right-bottom")
          : null,
        pane: group?.activePane ?? "left",
        panel,
      };
    },
    [openPanel],
  );

  const restoreView = useCallback((snapshot: ViewSnapshot) => {
    const state = useNotepadStore.getState();
    const exists =
      snapshot.groupId === ALL_GROUP_ID ||
      state.groups.some((group) => group.id === snapshot.groupId);
    const fallbackGroupId = state.groups[0]?.id;
    if (!exists && !fallbackGroupId) return;

    state.selectGroup(exists ? snapshot.groupId : fallbackGroupId);
    const targetGroup = getActiveGroup(useNotepadStore.getState());
    if (!targetGroup) return;
    const snapshotTabIds: Record<PaneId, string | null> = {
      left: snapshot.leftTabId,
      right: snapshot.rightTabId,
      "left-bottom": snapshot.leftBottomTabId,
      "right-bottom": snapshot.rightBottomTabId,
    };
    for (const pane of PANE_IDS) {
      const paneTabs = getPaneTabs(targetGroup, pane);
      const tab =
        paneTabs.find((item) => item.id === snapshotTabIds[pane]) ??
        paneTabs[0];
      if (tab) state.selectTab(tab.id);
    }
    state.setActivePane(snapshot.pane);
    setOpenPanel((current) =>
      snapshot.panel === null && keepsPanelOpenRef.current()
        ? current
        : snapshot.panel,
    );
  }, []);

  const { pushView, replaceView } = useViewHistory(
    hydrated,
    getCurrentView(null),
    restoreView,
  );

  const replaceCurrentView = useCallback(
    () => replaceView(getCurrentView()),
    [getCurrentView, replaceView],
  );

  const closeSidePanels = useCallback(() => {
    if (openPanel === null) return;
    setOpenPanel(null);
    pushView(getCurrentView(null));
  }, [getCurrentView, openPanel, pushView]);

  const toggleSidePanel = useCallback(
    (panel: ViewPanel) => {
      if (openPanel === panel) {
        if (
          panel === "bookmarks" ||
          panel === "dashboard" ||
          panel === "global-search" ||
          panel === "closed" ||
          !keepsPanelOpen()
        )
          closeSidePanels();
        return;
      }
      setOpenPanel(panel);
      pushView(getCurrentView(panel));
    },
    [closeSidePanels, getCurrentView, keepsPanelOpen, openPanel, pushView],
  );

  // Records a panel action; the panel closes unless it is pinned.
  const finishPanelAction = useCallback(() => {
    const panel = keepsPanelOpen() ? openPanel : null;
    setOpenPanel(panel);
    pushView(getCurrentView(panel));
  }, [getCurrentView, keepsPanelOpen, openPanel, pushView]);

  const actions = useViewActions({
    getCurrentView,
    pushView,
    finishPanelAction,
    addTabToPane,
  });

  useEffect(() => {
    if (openPanel === null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== "Escape" ||
        event.isComposing ||
        event.defaultPrevented ||
        document.querySelector("dialog[open]")
      )
        return;
      if (keepsPanelOpen()) return;
      event.preventDefault();
      if (document.activeElement instanceof HTMLElement)
        document.activeElement.blur();
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
    replaceCurrentView,
    ...actions,
  };
}
