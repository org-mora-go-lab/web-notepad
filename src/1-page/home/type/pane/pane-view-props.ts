import type { RefObject } from "react";

import type { GroupEntry, NoteTab, PaneId } from "@/src/4-entity/notepad";
import type { PaneDropZone } from "@/src/5-shared";

export type PaneViewProps = {
  pane: PaneId;
  heightRatio?: number;
  hasMenu: boolean;
  onOpenSettings?: () => void;
  onOpenShortcuts?: () => void;
  tabs: NoteTab[];
  groups: GroupEntry[];
  activeGroupId: string;
  activeTab: NoteTab;
  editorRef: RefObject<HTMLTextAreaElement | null>;
  composingRef: RefObject<boolean>;
  autoFocus?: boolean;
  isFocused: boolean;
  draggingTabId: string | null;
  dropZones: PaneDropZone[];
  onActivate: () => void;
  onSelect: (tabId: string) => void;
  onClose: (tabId: string) => void;
  onMove: (fromTabId: string, toTabId: string) => void;
  onMoveToGroup: (tabId: string, groupId: string) => void;
  onAdopt: (tabId: string) => void;
  onDragStateChange: (tabId: string | null) => void;
  onCycleTabColor: (tabId: string) => void;
  onTogglePin: (tabId: string) => void;
  onToggleBookmark: (tabId: string) => void;
  onAdd: () => void;
  onChange: (content: string) => void;
};
