import type { ClosedTabEntry, GroupEntry, NoteTab, TabColor, TabStatus } from "@/src/4-entity/notepad";

export type DashboardProps = {
  tabs: NoteTab[];
  activeTabId?: string;
  groups: GroupEntry[];
  // All: cards show the group they belong to.
  showGroupNames: boolean;
  tabColorCycle: TabColor[];
  statusNames: Partial<Record<TabStatus, string>>;
  open: boolean;
  pinned: boolean;
  onTogglePin: () => void;
  onClose: () => void;
  closedEntries: Array<{ entry: ClosedTabEntry; groupName: string }>;
  onRestoreClosed: (entryId: string) => void;
  onRemoveClosed: (entryId: string) => void;
  onOpenTab: (tabId: string) => void;
  onChangeStatus: (tabId: string, status: TabStatus) => void;
  onRenameStatus: (status: TabStatus, name: string) => void;
  onMoveToGroup: (tabId: string, groupId: string) => void;
  onToggleTabPin: (tabId: string) => void;
  onToggleTabBookmark: (tabId: string) => void;
  onArchiveTab: (tabId: string) => void;
};
