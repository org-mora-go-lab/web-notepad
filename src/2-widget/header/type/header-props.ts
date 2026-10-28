import type { GroupEntry, NoteTab } from "@/src/4-entity/notepad";

export type HeaderProps = {
  tabs: NoteTab[];
  groups: GroupEntry[];
  activeGroupId: string;
  activeTabId: string;
  draggingTabId: string | null;
  draggingTabIds: string[];
  selectedTabIds: string[];
  onSelect: (tabId: string, extendSelection: boolean) => void;
  onClose: (tabId: string) => void;
  onMove: (tabIds: string[], toTabId: string) => void;
  onMoveToGroup: (tabId: string, groupId: string) => void;
  onAdopt: (tabId: string) => void;
  onDragStart: (tabId: string) => void;
  onDragEnd: () => void;
  onCycleTabColor: (tabId: string) => void;
  onToggleBookmark: (tabId: string) => void;
  onAdd: () => void;
};
