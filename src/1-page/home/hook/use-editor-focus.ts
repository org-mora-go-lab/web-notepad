"use client";

import { useEffect } from "react";

import { type PaneId, useNotepadStore } from "@/src/4-entity/notepad";

import type { PaneRefs } from "./use-pane-refs";

// Focuses the active pane's editor with the caret at the end whenever the active tab or pane changes.
export function useEditorFocus(
  editorRefs: PaneRefs<HTMLTextAreaElement | null>,
  activeGroupId: string,
  activePane: PaneId,
  activeTabId: string,
  hydrated: boolean,
) {
  useEffect(() => {
    if (!hydrated) return;

    const frame = window.requestAnimationFrame(() => {
      const currentTab = useNotepadStore
        .getState()
        .groups.find((group) => group.id === activeGroupId)
        ?.tabs.find((tab) => tab.id === activeTabId);
      const editor = editorRefs[activePane].current;
      if (!currentTab || !editor) return;
      if (window.matchMedia("(pointer: coarse)").matches) {
        return;
      }

      editor.focus();
      editor.setSelectionRange(
        currentTab.content.length,
        currentTab.content.length,
      );
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeGroupId, activePane, activeTabId, editorRefs, hydrated]);
}
