"use client";

import { Editor } from "./component";
import { useNoteEditor } from "./hook";
import type { NoteEditorProps } from "./type";

export function NoteEditor({
  tab,
  editorRef,
  composingRef,
  autoFocus = false,
  onChange,
}: NoteEditorProps) {
  const {
    lineRailRef,
    selectedLines,
    toggleLineSelection,
    handleChange,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
    handleScroll,
  } = useNoteEditor({ tab, composingRef, onChange });

  return (
    <Editor
      tab={tab}
      editorRef={editorRef}
      lineRailRef={lineRailRef}
      selectedLines={selectedLines}
      autoFocus={autoFocus}
      onToggleLineSelection={toggleLineSelection}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onScroll={handleScroll}
    />
  );
}
