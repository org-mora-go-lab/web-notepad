import type { RefObject } from "react";

import type { GroupEntry, NoteTab, PaneColumn, PaneId } from "@/src/4-entity/notepad";
import type { PaneDropZone } from "@/src/5-shared";
import type { TabStripState } from "@/src/5-shared/hook";

export type PaneViewProps = {
  pane: PaneId;
  hasMenu: boolean;
  closedCount?: number;
  onOpenClosed?: () => void;
  onOpenShortcuts?: () => void;
  tabs: NoteTab[];
  groups: GroupEntry[];
  activeGroupId: string;
  activeTab: NoteTab;
  tabStrip: TabStripState;
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

// A left or right column with a top pane and an optional bottom pane.
export type PaneColumnProps = {
  column: PaneColumn;
  panes: PaneViewProps[];
  widthRatio?: number;
  rowRatio: number;
  onResize?: (ratio: number) => void;
  onRowResize: (ratio: number) => void;
};
