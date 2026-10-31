"use client";

import { Editor } from "./component";
import { useNoteEditor } from "./hook";
import type { NoteEditorProps } from "./type";

export function NoteEditor({
  tab,
  editorRef,
  composingRef,
  onChange,
}: NoteEditorProps) {
  const {
    scrollRef,
    lineRailRef,
    selectedLines,
    toggleLineSelection,
    handleChange,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
  } = useNoteEditor({ tab, composingRef, onChange });

  return (
    <Editor
      tab={tab}
      editorRef={editorRef}
      scrollRef={scrollRef}
      lineRailRef={lineRailRef}
      selectedLines={selectedLines}
      onToggleLineSelection={toggleLineSelection}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
    />
  );
}
