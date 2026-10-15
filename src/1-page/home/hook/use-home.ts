"use client";

import { useCallback } from "react";

import {
  getActiveGroup,
  getBottomPane,
  getPaneWorkspace,
  type PaneColumn,
  type PaneId,
  useNotepadHydrated,
  useNotepadStore,
} from "@/src/4-entity/notepad";
import { isToday } from "@/src/5-shared/util";

import type { PaneColumnProps, PaneViewProps } from "../type";
import { useHomeNavigation, usePanelPin } from "./navigation";
import { useNotepadShortcuts } from "./shortcut";
import {
  useEditorFocus,
  useHomeTabActions,
  usePaneDrag,
  usePaneRefs,
} from "./workspace";

const COLUMNS: PaneColumn[] = ["left", "right"];

export function useHome() {
  const hydrated = useNotepadHydrated();
  const editorRefs = usePaneRefs<HTMLTextAreaElement | null>(null);
  const composingRefs = usePaneRefs(false);
  const store = useNotepadStore();
  const {
    groups,
    activeGroupId,
    closedTabs,
    updateTab,
    moveTab,
    setSplitRatio,
    setRowRatio,
    cycleTabColor,
    togglePin,
    toggleBookmark,
    setTabStatus,
    moveClosedTabToStatus,
    moveClosedTabToGroup,
    toggleClosedTabBookmark,
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
  const hasBookmarkUpdateToday = bookmarks.some((bookmark) =>
    isToday(bookmark.updatedAt),
  );
  const { panelPinned, togglePanelPin } = usePanelPin();

  const {
    tabs: paneTabs,
    activeTabs,
    activePane,
    activeTab,
    split,
  } = getPaneWorkspace(activeGroup);
  const paneActiveTab = (pane: PaneId) => activeTabs[pane];

  const {
    requestCloseTab: requestCloseTabAction,
    addTabToPane,
    moveToGroup,
  } = useHomeTabActions({ editorRefs });

  const navigation = useHomeNavigation({ hydrated, panelPinned, addTabToPane });
  const {
    openPanel,
    selectTabWithHistory,
    activatePaneWithHistory,
    addTabAndRecord,
    moveTabToPaneAndRecord,
    replaceCurrentView,
  } = navigation;

  const requestCloseTab = useCallback(
    (tabId: string) => {
      if (requestCloseTabAction(tabId)) replaceCurrentView();
    },
    [replaceCurrentView, requestCloseTabAction],
  );

  useNotepadShortcuts({
    editorRefs,
    composingRefs,
    requestCloseTab,
    onSelectTab: selectTabWithHistory,
    onAddTab: addTabAndRecord,
    onMoveTabToPane: moveTabToPaneAndRecord,
  });
  useEditorFocus(
    editorRefs,
    activeGroupId,
    activePane,
    activeTab?.id ?? "",
    hydrated,
  );

  const { draggingTabId, setDraggingTabId, adoptTo, dropZonesFor } =
    usePaneDrag({
      group: activeGroup,
      moveTabToPane: moveTabToPaneAndRecord,
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
    return [
      {
        column,
        panes,
        widthRatio:
          column === "left" && hasRightColumn
            ? activeGroup?.splitRatio
            : undefined,
        rowRatio:
          (column === "right"
            ? activeGroup?.rightRowRatio
            : activeGroup?.leftRowRatio) ?? 0.5,
        onResize: column === "right" ? setSplitRatio : undefined,
        onRowResize: (ratio: number) => setRowRatio(column, ratio),
      },
    ];
  });

  return {
    hydrated,
    closedTabs,
    ...navigation,
    openPanel,
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
    togglePin,
    toggleBookmark,
    moveToGroup,
    moveClosedTabToStatus,
    moveClosedTabToGroup,
    toggleClosedTabBookmark,
    removeBookmark,
    createGroup,
    renameGroup,
    toggleGroupPin,
    removeGroup,
    fontScale: settings.fontScale,
    language: settings.language,
    panelSlide: settings.panelSlide,
    panelPosition: settings.panelPosition,
  };
}
