import type { DashboardStatusNames, GroupEntry, NoteTab, TabColor, TabStatus } from "@/src/4-entity/notepad";

export type DashboardProps = {
  groupId: string;
  statusNames: DashboardStatusNames;
  onSaveStatusNames: (names: DashboardStatusNames) => void;
  tabs: NoteTab[];
  activeTabId?: string;
  groups: GroupEntry[];
  // All: cards show the group they belong to.
  showGroupNames: boolean;
  tabColorCycle: TabColor[];
  open: boolean;
  pinned: boolean;
  onTogglePin: () => void;
  onClose: () => void;
  onOpenTab: (tabId: string) => void;
  onAddTask: () => void;
  onChangeStatus: (tabId: string, status: TabStatus) => void;
  onMoveToGroup: (tabId: string, groupId: string) => void;
  onToggleTabPin: (tabId: string) => void;
  onToggleTabBookmark: (tabId: string) => void;
  onDeleteTab: (tabId: string) => void;
};
