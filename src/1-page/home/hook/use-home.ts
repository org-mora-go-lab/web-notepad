"use client";

import { useCallback } from "react";

import {
  ALL_GROUP_ID,
  DEFAULT_DASHBOARD_VISIBILITY,
  getActiveGroup,
  getBottomPane,
  getPaneWorkspace,
  type PaneColumn,
  type PaneId,
  UNGROUPED_GROUP_ID,
  useNotepadHydrated,
  useNotepadStore,
} from "@/src/4-entity/notepad";
import { MESSAGES } from "@/src/5-shared/constant";
import { isToday } from "@/src/5-shared/util";

import type { PaneColumnProps, PaneViewProps } from "../type";
import { useHomeNavigation } from "./navigation";
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
    moveTabs,
    setSplitRatio,
    setRowRatio,
    cycleTabColor,
    togglePin,
    toggleBookmark,
    setTabStatus,
    deleteTab,
    removeClosedTab,
    removeBookmark,
    createGroup,
    renameGroup,
    setGroupStatusNames,
    setGroupDashboardVisibility,
    toggleGroupPin,
    moveGroup,
    removeGroup,
    settings,
  } = store;

  const activeGroup = getActiveGroup(store);
  const bookmarks = activeGroup?.bookmarks ?? [];
  const activeGroupTabs = activeGroup?.tabs ?? [];
  const messages = MESSAGES[settings.language];
  const activeGroupName = activeGroupId === ALL_GROUP_ID
    ? messages.allGroup
    : activeGroupId === UNGROUPED_GROUP_ID
      ? messages.ungrouped
      : activeGroup?.name ?? messages.ungrouped;
  const hasBookmarkUpdateToday = bookmarks.some((bookmark) =>
    isToday(bookmark.updatedAt),
  );
  const hasGroupUpdateToday = groups.some((group) => isToday(group.updatedAt));

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

  const navigation = useHomeNavigation({ hydrated, addTabToPane });
  const {
    openPanel,
    selectTabWithHistory,
    activatePaneWithHistory,
    addTabAndRecord,
    moveTabToPaneAndRecord,
    replaceCurrentView,
    toggleGroupMenu,
    toggleSidePanel,
  } = navigation;

  const requestCloseTab = useCallback(
    (tabId: string) => {
      if (requestCloseTabAction(tabId)) replaceCurrentView();
    },
    [replaceCurrentView, requestCloseTabAction],
  );

  const deleteDashboardTab = useCallback(
    (tabId: string) => {
      deleteTab(tabId);
      replaceCurrentView();
    },
    [deleteTab, replaceCurrentView],
  );

  useNotepadShortcuts({
    editorRefs,
    composingRefs,
    requestCloseTab,
    onSelectTab: selectTabWithHistory,
    onAddTab: addTabAndRecord,
    onToggleGroups: toggleGroupMenu,
    onToggleDashboard: () => toggleSidePanel("dashboard"),
  });
  useEditorFocus(
    editorRefs,
    activeGroupId,
    activePane,
    activeTab?.id ?? "",
    hydrated,
  );

  const {
    draggingTabId,
    draggingTabIds,
    selectedTabIds,
    selectTabRange,
    startDrag,
    endDrag,
    adoptTo,
    dropZonesFor,
  } = usePaneDrag({
      group: activeGroup,
      moveTabsToPane: moveTabToPaneAndRecord,
    });

  // The search command sits on the top pane of the rightmost column.
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
      draggingTabIds,
      selectedTabIds,
      tabs: paneTabs[pane],
      activeTab: paneTab,
      editorRef: editorRefs[pane],
      composingRef: composingRefs[pane],
      autoFocus: pane === "left",
      isFocused: !split || activePane === pane,
      dropZones: dropZonesFor(pane),
      onActivate: () => activatePaneWithHistory(pane),
      onSelect: (tabId: string, extendSelection: boolean) => {
        selectTabRange(paneTabs[pane], tabId, extendSelection);
        selectTabWithHistory(tabId);
      },
      onClose: requestCloseTab,
      onMove: (tabIds: string[], toTabId: string) =>
        tabIds.length === 1
          ? moveTab(tabIds[0], toTabId)
          : moveTabs(tabIds, toTabId),
      onMoveToGroup: moveToGroup,
      onAdopt: adoptTo(pane),
      onDragStart: startDrag,
      onDragEnd: endDrag,
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
    groups: groups.map((group) => group.id === UNGROUPED_GROUP_ID
      ? { ...group, name: messages.ungrouped }
      : group),
    activeGroupName,
    hasBookmarkUpdateToday,
    hasGroupUpdateToday,
    columns,
    activeGroupTabs,
    tabColorCycle: settings.tabColorCycle,
    setTabStatus,
    togglePin,
    toggleBookmark,
    moveToGroup,
    deleteDashboardTab,
    removeClosedTab,
    removeBookmark,
    createGroup,
    renameGroup,
    setGroupStatusNames,
    setGroupDashboardVisibility,
    dashboardVisibility: activeGroup?.dashboardVisibility ?? DEFAULT_DASHBOARD_VISIBILITY,
    toggleGroupPin,
    moveGroup,
    removeGroup,
    fontScale: settings.fontScale,
    language: settings.language,
    panelSlide: settings.panelSlide,
    panelPosition: settings.panelPosition,
  };
}
