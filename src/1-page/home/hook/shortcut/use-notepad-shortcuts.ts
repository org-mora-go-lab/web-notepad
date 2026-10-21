"use client";

import { useEffect } from "react";

import {
  getActiveGroup,
  getPaneActiveTabId,
  getPaneColumn,
  getPaneTabs,
  PANE_IDS,
  type PaneId,
  useNotepadStore,
} from "@/src/4-entity/notepad";
import { isAltBackspace } from "@/src/5-shared";

import type { PaneRefs } from "../workspace";
import { useSelectAllShortcut } from "./use-select-all-shortcut";

type Options = {
  editorRefs: PaneRefs<HTMLTextAreaElement | null>;
  composingRefs: PaneRefs<boolean>;
  requestCloseTab: (tabId: string) => void;
  onSelectTab: (tabId: string) => void;
  onAddTab: (pane: PaneId) => void;
  onMoveTabToPane: (tabId: string, pane: PaneId) => void;
  onToggleGroups: () => void;
};

const matchesKey = (event: KeyboardEvent, ...names: string[]) =>
  names.includes(event.key) || names.includes(event.code);

export function useNotepadShortcuts({
  editorRefs,
  composingRefs,
  requestCloseTab,
  onSelectTab,
  onAddTab,
  onMoveTabToPane,
  onToggleGroups,
}: Options) {
  useSelectAllShortcut({ editorRefs });

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (
        event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.shiftKey &&
        matchesKey(event, "b", "B", "KeyB")
      ) {
        if (
          event.defaultPrevented ||
          event.isComposing ||
          document.querySelector("dialog:modal")
        ) return;
        event.preventDefault();
        if (!event.repeat) onToggleGroups();
        return;
      }

      const state = useNotepadStore.getState();
      const activeGroup = getActiveGroup(state);
      if (!activeGroup) return;
      const pane = activeGroup.activePane;
      const paneActiveId = getPaneActiveTabId(activeGroup, pane) ?? "";
      const flushActiveEditor = () => {
        const activeEditor = editorRefs[pane].current;
        if (activeEditor && paneActiveId) {
          state.updateTab(paneActiveId, activeEditor.value);
        }
      };

      // The Korean IME swallows the first shortcut key while composing, so commit as soon as a modifier is held.
      const composingPane = PANE_IDS.find(
        (id) =>
          composingRefs[id].current &&
          document.activeElement === editorRefs[id].current,
      );
      if (composingPane && (event.metaKey || event.altKey)) {
        const editor = editorRefs[composingPane].current;
        composingRefs[composingPane].current = false;
        editor?.blur();
        editor?.focus();
      }

      if (isAltBackspace(event)) {
        event.preventDefault();
        if (!event.repeat) requestCloseTab(paneActiveId);
        return;
      }

      if (!event.altKey || event.ctrlKey || event.metaKey) return;

      if (event.key === "Tab") {
        event.preventDefault();
        flushActiveEditor();
        onAddTab(pane);
        return;
      }

      if (event.shiftKey) return;

      const isF12 = matchesKey(event, "F12");
      if (isF12 || matchesKey(event, "F11")) {
        event.preventDefault();
        // F11/F12 move the tab between columns, into the top pane of the other column.
        const targetPane = isF12 ? "right" : "left";
        if (getPaneColumn(pane) === targetPane || !paneActiveId) return;

        flushActiveEditor();
        onMoveTabToPane(paneActiveId, targetPane);
        window.requestAnimationFrame(() => {
          const movedPane =
            getActiveGroup(useNotepadStore.getState())?.activePane ?? "left";
          editorRefs[movedPane].current?.focus();
        });
        return;
      }

      const isArrowUp = matchesKey(event, "ArrowUp", "Up");
      if (isArrowUp || matchesKey(event, "ArrowDown", "Down")) {
        event.preventDefault();
        // Navigation runs down the left column and then continues down the right column.
        const orderedTabs = PANE_IDS.flatMap((id) =>
          getPaneTabs(activeGroup, id),
        );
        const currentIndex = orderedTabs.findIndex(
          (tab) => tab.id === paneActiveId,
        );
        const nextTab = orderedTabs[currentIndex + (isArrowUp ? -1 : 1)];
        if (currentIndex >= 0 && nextTab) onSelectTab(nextTab.id);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [
    composingRefs,
    editorRefs,
    onAddTab,
    onMoveTabToPane,
    onSelectTab,
    onToggleGroups,
    requestCloseTab,
  ]);
}
