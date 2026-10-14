import type { ChangeEvent, KeyboardEvent, RefObject, UIEvent } from "react";

import type { NoteTab } from "@/src/4-entity/notepad";

export type EditorProps = {
  tab: NoteTab;
  editorRef: RefObject<HTMLTextAreaElement | null>;
  lineRailRef: RefObject<HTMLDivElement | null>;
  selectedLines: number[];
  autoFocus: boolean;
  onToggleLineSelection: (lineIndex: number, extendSelection?: boolean) => void;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onCompositionStart: () => void;
  onCompositionEnd: () => void;
  onScroll: (event: UIEvent<HTMLTextAreaElement>) => void;
};
