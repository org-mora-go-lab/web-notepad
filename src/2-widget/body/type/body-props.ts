import type { RefObject } from "react";

import type { NoteTab } from "@/src/4-entity/notepad";
import type { PaneDropZone } from "@/src/5-shared";

export type BodyProps = {
  activeTab: NoteTab;
  editorRef: RefObject<HTMLTextAreaElement | null>;
  composingRef: RefObject<boolean>;
  autoFocus?: boolean;
  draggingTabId: string | null;
  dropZones: PaneDropZone[];
  tabSlide?: { direction: "left" | "right"; sequence: number };
  onSwipeTabs?: (direction: "left" | "right") => boolean | void;
  onChange: (content: string) => void;
};
