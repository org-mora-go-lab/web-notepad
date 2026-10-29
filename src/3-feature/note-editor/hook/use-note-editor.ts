import type { ChangeEvent, KeyboardEvent } from "react";
import { type RefObject, useEffect, useRef } from "react";

import type { NoteTab } from "@/src/4-entity/notepad";

import {
  handleEditorKeyDown,
  insertAtSelection,
  recordEditorHistory,
} from "../util";
import { useEditorCaretScroll } from "./layout";
import { useLineSelection } from "./use-line-selection";

type Options = {
  tab: NoteTab;
  composingRef: RefObject<boolean>;
  onChange: (content: string) => void;
};

export function useNoteEditor({ tab, composingRef, onChange }: Options) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lineRailRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef(tab.content);
  const pendingTabInsertionRef = useRef<HTMLTextAreaElement | null>(null);
  const followCaretOnEnter = useEditorCaretScroll(scrollRef);
  const { selectedLines, toggleLineSelection } = useLineSelection(tab);

  useEffect(() => {
    contentRef.current = tab.content;
  }, [tab.content]);

  const commitContent = (content: string) => {
    const previousContent = contentRef.current;
    if (content === previousContent) return;

    recordEditorHistory(tab.id, previousContent);
    contentRef.current = content;
    onChange(content);
  };

  const insertTab = (textarea: HTMLTextAreaElement) => {
    const content = textarea.value;
    const { selectionStart, selectionEnd } = textarea;
    commitContent(content);
    const { content: nextContent, cursorPosition } = insertAtSelection(
      content,
      selectionStart,
      selectionEnd,
      "\t",
    );
    commitContent(nextContent);

    window.requestAnimationFrame(() => {
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    });
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    commitContent(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const shouldFollowEnter =
      event.key === "Enter" &&
      !event.nativeEvent.isComposing &&
      !composingRef.current;
    const textarea = event.currentTarget;

    handleEditorKeyDown(event, {
      tabId: tab.id,
      contentRef,
      composingRef,
      onChange,
      commitContent,
      insertTab,
      hasPendingTabInsertion: () => pendingTabInsertionRef.current !== null,
      queueTabInsertion: (textarea) => {
        pendingTabInsertionRef.current = textarea;
      },
    });

    if (shouldFollowEnter) followCaretOnEnter(textarea);
  };

  const handleCompositionStart = () => {
    composingRef.current = true;
  };

  const handleCompositionEnd = () => {
    composingRef.current = false;
    const pendingTextarea = pendingTabInsertionRef.current;
    if (!pendingTextarea) return;

    window.requestAnimationFrame(() => {
      if (pendingTabInsertionRef.current !== pendingTextarea) return;
      pendingTabInsertionRef.current = null;
      insertTab(pendingTextarea);
    });
  };

  return {
    scrollRef,
    lineRailRef,
    selectedLines,
    toggleLineSelection,
    handleChange,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
  };
}
