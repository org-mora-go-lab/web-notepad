"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

import { type PaneId, useNotepadStore } from "@/src/4-entity/notepad";
import { HOME_RETURN_FOCUS_KEY } from "@/src/5-shared/constant";

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
  const userInteractionRef = useRef(false);
  useLayoutEffect(() => {
    let restoreFrame = 0;
    let historyGuardFrame = 0;
    let historyGuardAttempts = 0;
    const blurEditors = () => {
      for (const editor of Object.values(editorRefs)) {
        if (document.activeElement === editor.current) editor.current?.blur();
      }
    };
    const blockCachedFocus = () => {
      allowFocusRef.current = false;
      userInteractionRef.current = false;
      blurEditors();
    };
    const finishCachedRestore = (event: PageTransitionEvent) => {
      const navigation = performance.getEntriesByType("navigation")[0] as
        PerformanceNavigationTiming | undefined;
      let markedReturn = false;
      try {
        markedReturn = sessionStorage.getItem(HOME_RETURN_FOCUS_KEY) === "1";
      } catch {
        /* The navigation type still protects history restoration. */
      }
      if (
        !markedReturn &&
        !event.persisted &&
        navigation?.type !== "back_forward"
      )
        return;
      blockCachedFocus();
      restoreFrame = window.requestAnimationFrame(() => {
        blockCachedFocus();
        restoreFrame = window.requestAnimationFrame(blockCachedFocus);
      });
    };
    const allowFromHomeInteraction = (event: Event) => {
      const home = document.querySelector(".home");
      const targetIsInHome =
        event.target instanceof Node && home?.contains(event.target);
      const keyboardStartedFromDocument =
        event.type === "keydown" &&
        (event.target === document.body ||
          event.target === document.documentElement);
      if (targetIsInHome || keyboardStartedFromDocument) {
        allowFocusRef.current = true;
        userInteractionRef.current = true;
      }
    };
    const preventBlockedEditorFocus = (event: FocusEvent) => {
      const navigation = performance.getEntriesByType("navigation")[0] as
        PerformanceNavigationTiming | undefined;
      const waitingForHistoryInteraction =
        navigation?.type === "back_forward" && !userInteractionRef.current;
      if (allowFocusRef.current && !waitingForHistoryInteraction) return;
      const editor = Object.values(editorRefs).find(
        (candidate) => candidate.current === event.target,
      )?.current;
      editor?.blur();
    };
    const navigation = performance.getEntriesByType("navigation")[0] as
      PerformanceNavigationTiming | undefined;
    if (suppressInitialFocus || navigation?.type === "back_forward")
      blockCachedFocus();
    const guardDelayedHistoryFocus = () => {
      const delayedNavigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming | undefined;
      if (
        delayedNavigation?.type === "back_forward" &&
        !userInteractionRef.current
      )
        blockCachedFocus();
      historyGuardAttempts += 1;
      if (historyGuardAttempts < 60 && !userInteractionRef.current)
        historyGuardFrame = window.requestAnimationFrame(
          guardDelayedHistoryFocus,
        );
    };
    historyGuardFrame = window.requestAnimationFrame(guardDelayedHistoryFocus);
    document.addEventListener("pointerdown", allowFromHomeInteraction);
    document.addEventListener("keydown", allowFromHomeInteraction);
    document.addEventListener("focusin", preventBlockedEditorFocus, true);
    window.addEventListener("pagehide", blockCachedFocus);
    window.addEventListener("pageshow", finishCachedRestore);
    return () => {
      window.cancelAnimationFrame(restoreFrame);
      window.cancelAnimationFrame(historyGuardFrame);
      document.removeEventListener("pointerdown", allowFromHomeInteraction);
      document.removeEventListener("keydown", allowFromHomeInteraction);
      document.removeEventListener("focusin", preventBlockedEditorFocus, true);
      window.removeEventListener("pagehide", blockCachedFocus);
      window.removeEventListener("pageshow", finishCachedRestore);
    };
  }, [editorRefs, suppressInitialFocus]);
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
      // Workspace updates must not steal focus from a menu or another control.
      // A tab, line, or history interaction inside the workspace may still
      // hand focus between editors, preserving edit-continuity behavior.
      const activeElement = document.activeElement;
      const focusIsInWorkspace = activeElement?.closest?.(".note-pane") != null;
      if (
        activeElement !== document.body &&
        activeElement !== document.documentElement &&
        activeElement !== editor &&
        !focusIsInWorkspace
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
