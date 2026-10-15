import { useCallback } from "react";

import {
  getActiveGroup,
  type PaneId,
  useNotepadStore,
} from "@/src/4-entity/notepad";
import type { ViewPanel } from "@/src/5-shared";

import type { ViewSnapshot } from "../../type";

type Options = {
  getCurrentView: (panel?: ViewPanel | null) => ViewSnapshot;
  pushView: (snapshot: ViewSnapshot) => void;
  finishPanelAction: () => void;
  addTabToPane: (pane: PaneId) => void;
};

export function useViewActions({
  getCurrentView,
  pushView,
  finishPanelAction,
  addTabToPane,
}: Options) {
  const selectTabWithHistory = useCallback(
    (tabId: string) => {
      useNotepadStore.getState().selectTab(tabId);
      pushView(getCurrentView());
    },
    [getCurrentView, pushView],
  );

  const activatePaneWithHistory = useCallback(
    (pane: PaneId) => {
      const state = useNotepadStore.getState();
      const group = getActiveGroup(state);
      if (!group || group.activePane === pane) return;
      state.setActivePane(pane);
      pushView(getCurrentView());
    },
    [getCurrentView, pushView],
  );

  const selectGroupAndClosePanel = useCallback(
    (groupId: string) => {
      useNotepadStore.getState().selectGroup(groupId);
      finishPanelAction();
    },
    [finishPanelAction],
  );

  // Creating or deleting a group can change the active group, so the view history records it.
  const createGroupAndRecord = useCallback(
    (name: string) => {
      useNotepadStore.getState().createGroup(name);
      pushView(getCurrentView());
    },
    [getCurrentView, pushView],
  );

  const removeGroupAndRecord = useCallback(
    (groupId: string) => {
      useNotepadStore.getState().removeGroup(groupId);
      pushView(getCurrentView());
    },
    [getCurrentView, pushView],
  );

  const openBookmarkAndClosePanel = useCallback(
    (groupId: string, bookmarkId: string) => {
      const state = useNotepadStore.getState();
      state.selectGroup(groupId);
      state.openBookmark(bookmarkId);
      finishPanelAction();
    },
    [finishPanelAction],
  );

  const openBookmarkInCurrentGroupAndClosePanel = useCallback(
    (bookmarkId: string) => {
      const state = useNotepadStore.getState();
      openBookmarkAndClosePanel(state.activeGroupId, bookmarkId);
    },
    [openBookmarkAndClosePanel],
  );

  const openTabAndClosePanel = useCallback(
    (tabId: string) => {
      useNotepadStore.getState().selectTab(tabId);
      finishPanelAction();
    },
    [finishPanelAction],
  );

  const restoreClosedTabAndClosePanel = useCallback(
    (entryId: string) => {
      useNotepadStore.getState().restoreClosedTab(entryId);
      finishPanelAction();
    },
    [finishPanelAction],
  );

  const addTabAndRecord = useCallback(
    (pane: PaneId) => {
      addTabToPane(pane);
      pushView(getCurrentView());
    },
    [addTabToPane, getCurrentView, pushView],
  );

  const moveTabToPaneAndRecord = useCallback(
    (tabId: string | string[], pane: PaneId) => {
      const state = useNotepadStore.getState();
      if (Array.isArray(tabId)) state.moveTabsToPane(tabId, pane);
      else state.moveTabToPane(tabId, pane);
      pushView(getCurrentView());
    },
    [getCurrentView, pushView],
  );

  return {
    selectTabWithHistory,
    activatePaneWithHistory,
    selectGroupAndClosePanel,
    createGroupAndRecord,
    removeGroupAndRecord,
    openBookmarkAndClosePanel,
    openBookmarkInCurrentGroupAndClosePanel,
    openTabAndClosePanel,
    restoreClosedTabAndClosePanel,
    addTabAndRecord,
    moveTabToPaneAndRecord,
  };
}
