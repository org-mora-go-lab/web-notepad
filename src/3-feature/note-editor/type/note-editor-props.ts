import type { RefObject } from "react";

import type { NoteTab } from "@/src/4-entity/notepad";

export type NoteEditorProps = {
  tab: NoteTab;
  editorRef: RefObject<HTMLTextAreaElement | null>;
  composingRef: RefObject<boolean>;
  onChange: (content: string) => void;
};
