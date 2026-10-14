import type { GroupEntry, NoteTab } from "@/src/4-entity/notepad";

export type HeaderProps = {
  closedCount?: number;
  onOpenClosed?: () => void;
  onOpenSettings?: () => void;
  onOpenShortcuts?: () => void;
  onOpenSearch?: () => void;
  tabs: NoteTab[];
  groups: GroupEntry[];
  activeGroupId: string;
  activeTabId: string;
  draggingTabId: string | null;
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
};
