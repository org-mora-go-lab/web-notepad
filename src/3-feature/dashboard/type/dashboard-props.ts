import type {
  ClosedTabEntry,
  GroupEntry,
  NoteTab,
  TabColor,
  TabStatus,
} from "@/src/4-entity/notepad";

export type DashboardProps = {
  tabs: NoteTab[];
  activeTabId?: string;
  // Closed tabs of the shown group(s); they fill the Closed column.
  closedTabs: ClosedTabEntry[];
  groups: GroupEntry[];
  // All Group: cards show the group they belong to.
  showGroupNames: boolean;
  tabColorCycle: TabColor[];
  open: boolean;
  pinned: boolean;
  onTogglePin: () => void;
  onClose: () => void;
  onOpenTab: (tabId: string) => void;
  onChangeStatus: (tabId: string, status: TabStatus) => void;
  onUnpinTab: (tabId: string) => void;
  onMoveToGroup: (tabId: string, groupId: string) => void;
  onToggleTabPin: (tabId: string) => void;
  onToggleTabBookmark: (tabId: string) => void;
  onRestoreClosed: (entryId: string) => void;
  onChangeClosedStatus: (entryId: string, status: TabStatus) => void;
};
