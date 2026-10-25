import type { DashboardStatusNames, DashboardVisibility, GroupEntry, NoteTab, TabColor, TabStatus } from "@/src/4-entity/notepad";

export type DashboardProps = {
  groupId: string;
  statusNames: DashboardStatusNames;
  onSaveStatusNames: (names: DashboardStatusNames) => void;
  visibility: DashboardVisibility;
  onVisibilityChange: (visibility: DashboardVisibility) => void;
  tabs: NoteTab[];
  activeTabId?: string;
  groups: GroupEntry[];
  // All: cards show the group they belong to.
  showGroupNames: boolean;
  tabColorCycle: TabColor[];
  open: boolean;
  onClose: () => void;
  onOpenTab: (tabId: string) => void;
  onChangeStatus: (tabId: string, status: TabStatus) => void;
  onMoveToGroup: (tabId: string, groupId: string) => void;
  onToggleTabBookmark: (tabId: string) => void;
  onDeleteTab: (tabId: string) => void;
};
