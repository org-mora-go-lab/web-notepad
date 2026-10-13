"use client";

import { useState } from "react";

import {
  getActiveGroup,
  getBottomPane,
  getPaneActiveTabId,
  getPaneTabs,
  type NoteTab,
  PANE_IDS,
  type PaneColumn,
  type PaneId,
  useNotepadStore,
} from "@/src/4-entity/notepad";
import { useTabStrip } from "@/src/5-shared/hook";
import { isToday } from "@/src/5-shared/util";

import type { PaneColumnProps, PaneViewProps } from "../type";
import { useEditorFocus } from "./use-editor-focus";
import { useHomeNavigation } from "./use-home-navigation";
import { useHomeTabActions } from "./use-home-tab-actions";
import { useNotepadShortcuts } from "./use-notepad-shortcuts";
import { usePaneDrag } from "./use-pane-drag";
import { usePaneRefs } from "./use-pane-refs";
import { usePanelPin } from "./use-panel-pin";
import { useStoreHydrated } from "./use-store-hydrated";

const COLUMNS: PaneColumn[] = ["left", "right"];

export function useHome() {
  const hydrated = useStoreHydrated();
  const [closedSearchQuery, setClosedSearchQuery] = useState("");
  const editorRefs = usePaneRefs<HTMLTextAreaElement | null>(null);
  const composingRefs = usePaneRefs(false);
  const store = useNotepadStore();
  const {
    groups,
    activeGroupId,
    closedTabs,
    removeClosedTab,
    updateTab,
    moveTab,
    moveTabToPane,
    setSplitRatio,
    setRowRatio,
    cycleTabColor,
    togglePin,
    toggleBookmark,
    setTabStatus,
    removeBookmark,
    createGroup,
    renameGroup,
    toggleGroupPin,
    removeGroup,
    settings,
  } = store;

  const activeGroup = getActiveGroup(store);
  const bookmarks = activeGroup?.bookmarks ?? [];
  const activeGroupTabs = activeGroup?.tabs ?? [];
  const activeGroupName = activeGroup?.name ?? "Ungrouped";
  const hasBookmarkUpdateToday = bookmarks.some((bookmark) => isToday(bookmark.updatedAt));
  const { panelPinned, togglePanelPin } = usePanelPin();

  const paneTabs = Object.fromEntries(
    PANE_IDS.map((pane) => [pane, activeGroup ? getPaneTabs(activeGroup, pane) : []]),
  ) as Record<PaneId, NoteTab[]>;
  const paneActiveTab = (pane: PaneId) => {
    const activeId = activeGroup ? getPaneActiveTabId(activeGroup, pane) : null;
    return paneTabs[pane].find((tab) => tab.id === activeId) ?? paneTabs[pane][0];
  };
  const openPanes = PANE_IDS.filter((pane) => paneTabs[pane].length > 0);
  const split = openPanes.length > 1;
  const activePane =
    activeGroup && openPanes.includes(activeGroup.activePane) ? activeGroup.activePane : "left";
  const activeTab = paneActiveTab(activePane) ?? paneActiveTab("left");

  const {
    pendingCloseTabId,
    requestCloseTab,
    addTabToPane,
    moveToGroup,
    cancelCloseTab,
    confirmCloseTab,
  } = useHomeTabActions({ editorRefs });

  const navigation = useHomeNavigation({ hydrated, panelPinned, addTabToPane });
  const {
    openPanel,
    selectTabWithHistory,
    activatePaneWithHistory,
    addTabAndRecord,
    moveTabToPaneAndRecord,
  } = navigation;

  useNotepadShortcuts({
    editorRefs,
    composingRefs,
    requestCloseTab,
    onSelectTab: selectTabWithHistory,
    onAddTab: addTabAndRecord,
    onMoveTabToPane: moveTabToPaneAndRecord,
  });
  useEditorFocus(editorRefs, activeGroupId, activePane, activeTab?.id ?? "", hydrated);

  const tabStrips = {
    left: useTabStrip(paneTabs.left.length, paneActiveTab("left")?.id ?? "", hydrated),
    right: useTabStrip(paneTabs.right.length, paneActiveTab("right")?.id ?? "", hydrated),
    "left-bottom": useTabStrip(
      paneTabs["left-bottom"].length,
      paneActiveTab("left-bottom")?.id ?? "",
      hydrated,
    ),
    "right-bottom": useTabStrip(
      paneTabs["right-bottom"].length,
      paneActiveTab("right-bottom")?.id ?? "",
      hydrated,
    ),
  };

  const { draggingTabId, setDraggingTabId, adoptTo, dropZonesFor } = usePaneDrag({
    group: activeGroup,
    moveTabToPane,
  });

  // The MENU sits on the top pane of the rightmost column.
  const menuPane: PaneId = paneTabs.right.length > 0 ? "right" : "left";

  const createPaneProps = (pane: PaneId): PaneViewProps | null => {
    const paneTab = paneActiveTab(pane);
    if (!paneTab) return null;
    return {
      pane,
      hasMenu: pane === menuPane,
      groups,
      activeGroupId,
      draggingTabId,
      tabs: paneTabs[pane],
      activeTab: paneTab,
      tabStrip: tabStrips[pane],
      editorRef: editorRefs[pane],
      composingRef: composingRefs[pane],
      autoFocus: pane === "left",
      isFocused: !split || activePane === pane,
      dropZones: dropZonesFor(pane),
      onActivate: () => activatePaneWithHistory(pane),
      onSelect: selectTabWithHistory,
      onClose: requestCloseTab,
      onMove: moveTab,
      onMoveToGroup: moveToGroup,
      onAdopt: adoptTo(pane),
      onDragStateChange: setDraggingTabId,
      onCycleTabColor: cycleTabColor,
      onTogglePin: togglePin,
      onToggleBookmark: toggleBookmark,
      onAdd: () => addTabAndRecord(pane),
      onChange: (content: string) => updateTab(paneTab.id, content),
    };
  };

  const hasRightColumn = paneTabs.right.length > 0;
  const columns: PaneColumnProps[] = COLUMNS.flatMap((column) => {
    const panes = [column, getBottomPane(column)]
      .map(createPaneProps)
      .filter((props): props is PaneViewProps => props !== null);
    if (panes.length === 0) return [];
    return [{
      column,
      panes,
      widthRatio: column === "left" && hasRightColumn ? activeGroup?.splitRatio : undefined,
      rowRatio: (column === "right" ? activeGroup?.rightRowRatio : activeGroup?.leftRowRatio) ?? 0.5,
      onResize: column === "right" ? setSplitRatio : undefined,
      onRowResize: (ratio: number) => setRowRatio(column, ratio),
    }];
  });

  return {
    hydrated,
    closedTabs,
    removeClosedTab,
    ...navigation,
    pendingCloseTabId,
    cancelCloseTab,
    confirmCloseTab,
    openPanel,
    closedSearchQuery,
    setClosedSearchQuery,
    activeGroupId,
    activeTab,
    split,
    bookmarks,
    groups,
    activeGroupName,
    hasBookmarkUpdateToday,
    panelPinned,
    togglePanelPin,
    columns,
    activeGroupTabs,
    tabColorCycle: settings.tabColorCycle,
    setTabStatus,
    removeBookmark,
    createGroup,
    renameGroup,
    toggleGroupPin,
    removeGroup,
    fontScale: settings.fontScale,
    language: settings.language,
    panelSlide: settings.panelSlide,
  };
}
