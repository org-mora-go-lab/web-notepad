import type { KeyboardEvent as ReactKeyboardEvent } from "react";

import {
  insertAtSelection,
  isImeComposing,
  removeTabIndent,
  toggleBoldAtSelection,
} from "./editor-content";
import { restoreEditorHistory } from "./editor-history";

type MutableRef<T> = { current: T };

type Options = {
  tabId: string;
  contentRef: MutableRef<string>;
  composingRef: MutableRef<boolean>;
  onChange: (content: string) => void;
  commitContent: (content: string) => void;
  insertTab: (textarea: HTMLTextAreaElement) => void;
  hasPendingTabInsertion: () => boolean;
  queueTabInsertion: (textarea: HTMLTextAreaElement) => void;
};

export function handleEditorKeyDown(
  event: ReactKeyboardEvent<HTMLTextAreaElement>,
  {
    tabId,
    contentRef,
    composingRef,
    onChange,
    commitContent,
    insertTab,
    hasPendingTabInsertion,
    queueTabInsertion,
  }: Options,
) {
  const isBold =
    event.metaKey &&
    !event.ctrlKey &&
    !event.altKey &&
    !event.shiftKey &&
    event.key.toLowerCase() === "b";
  if (isBold) {
    if (isImeComposing(event.nativeEvent, composingRef.current)) return;
    event.preventDefault();
    if (event.repeat) return;
    const textarea = event.currentTarget;
    const result = toggleBoldAtSelection(
      textarea.value,
      textarea.selectionStart,
      textarea.selectionEnd,
    );
    commitContent(result.content);
    // React can commit the controlled value before the next animation frame.
    // Restore the selection in the same task boundary so a rapid second
    // shortcut toggles the existing markers instead of appending new ones.
    queueMicrotask(() => {
      textarea.setSelectionRange(result.selectionStart, result.selectionEnd);
    });
    return;
  }

  const isUndo =
    (event.metaKey || event.ctrlKey) &&
    !event.altKey &&
    !event.shiftKey &&
    event.key.toLowerCase() === "z";
  const isRedo =
    (event.metaKey || event.ctrlKey) &&
    !event.altKey &&
    ((event.shiftKey && event.key.toLowerCase() === "z") ||
      (!event.shiftKey && event.key.toLowerCase() === "y"));

  if (isUndo || isRedo) {
    const restoredContent = restoreEditorHistory(
      tabId,
      contentRef.current,
      isUndo ? "undo" : "redo",
    );
    if (restoredContent === undefined) return;

    event.preventDefault();
    contentRef.current = restoredContent;
    onChange(restoredContent);
    return;
  }

  if (
    event.key === "Enter" &&
    !isImeComposing(event.nativeEvent, composingRef.current)
  ) {
    event.preventDefault();
    const textarea = event.currentTarget;
    const { content: nextContent, cursorPosition } = insertAtSelection(
      textarea.value,
      textarea.selectionStart,
      textarea.selectionEnd,
      "\n",
    );
    commitContent(nextContent);

    window.requestAnimationFrame(() => {
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    });
    return;
  }

  // Option+Tab creates a note tab in the workspace shortcut handler.
  // Do not queue the regular Tab insertion: its animation-frame callback can
  // run after the active tab changes and read the new tab's textarea value.
  if (event.key !== "Tab" || event.altKey || event.ctrlKey || event.metaKey)
    return;

  if (event.shiftKey) {
    if (isImeComposing(event.nativeEvent, composingRef.current)) return;
    const textarea = event.currentTarget;
    const result = removeTabIndent(
      textarea.value,
      textarea.selectionStart,
      textarea.selectionEnd,
    );
    if (!result) return;
    event.preventDefault();
    commitContent(result.content);
    window.requestAnimationFrame(() => {
      textarea.setSelectionRange(result.selectionStart, result.selectionEnd);
    });
    return;
  }

  event.preventDefault();
  const textarea = event.currentTarget;
  if (hasPendingTabInsertion()) return;
  if (isImeComposing(event.nativeEvent, composingRef.current)) {
    queueTabInsertion(textarea);
    return;
  }
  insertTab(textarea);
}
