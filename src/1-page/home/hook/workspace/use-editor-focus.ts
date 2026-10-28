"use client";

import { useEffect, useRef } from "react";

import { type PaneId, useNotepadStore } from "@/src/4-entity/notepad";

import type { PaneRefs } from "./use-pane-refs";

// Focuses the active editor after a tab or pane change, except until the first home interaction after returning from another page.
export function useEditorFocus(
  editorRefs: PaneRefs<HTMLTextAreaElement | null>,
  activeGroupId: string,
  activePane: PaneId,
  activeTabId: string,
  hydrated: boolean,
  suppressInitialFocus: boolean,
) {
  const allowFocusRef = useRef(!suppressInitialFocus);
  useEffect(() => {
    if (!suppressInitialFocus) return;
    const allowFromHomeInteraction = (event: Event) => {
      const home = document.querySelector(".home");
      if (event.target instanceof Node && home?.contains(event.target))
        allowFocusRef.current = true;
    };
    document.addEventListener("pointerdown", allowFromHomeInteraction);
    document.addEventListener("keydown", allowFromHomeInteraction);
    document.addEventListener("focusin", allowFromHomeInteraction);
    return () => {
      document.removeEventListener("pointerdown", allowFromHomeInteraction);
      document.removeEventListener("keydown", allowFromHomeInteraction);
      document.removeEventListener("focusin", allowFromHomeInteraction);
    };
  }, [suppressInitialFocus]);
  useEffect(() => {
    if (!hydrated || !allowFocusRef.current) return;

    const frame = window.requestAnimationFrame(() => {
      const currentTab = useNotepadStore
        .getState()
        .groups.find((group) => group.id === activeGroupId)
        ?.tabs.find((tab) => tab.id === activeTabId);
      const editor = editorRefs[activePane].current;
      if (
        !currentTab ||
        !editor ||
        document.querySelector('[aria-modal="true"]')
      )
        return;
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
  }, [
    activeGroupId,
    activePane,
    activeTabId,
    editorRefs,
    hydrated,
    suppressInitialFocus,
  ]);
}
