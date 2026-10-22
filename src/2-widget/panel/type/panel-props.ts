import type { ComponentProps } from "react";

import type {
  Bookmark,
  Dashboard,
  Group,
} from "@/src/3-feature";
import type {
  BookmarkEntry,
  GroupEntry,
  NoteTab,
  TabColor,
} from "@/src/4-entity/notepad";
import type { ViewPanel } from "@/src/5-shared";

export type PanelProps = {
  onSaveDashboardStatusNames: ComponentProps<typeof Dashboard>["onSaveStatusNames"];
  dashboardVisibility: ComponentProps<typeof Dashboard>["visibility"];
  onDashboardVisibilityChange: ComponentProps<typeof Dashboard>["onVisibilityChange"];
  openPanel: ViewPanel | null;
  backgroundPanel: ViewPanel | null;
  bookmarks: BookmarkEntry[];
  activeGroupTabs: NoteTab[];
  activeTabId?: string;
  tabColorCycle: TabColor[];
  groups: GroupEntry[];
  activeGroupId: string;
  groupMenuOpen: boolean;
  globalSearchQuery: string;
  onClose: () => void;
  onCloseGroupMenu: () => void;
  onGlobalSearchQueryChange: (query: string) => void;
  onOpenBookmark: ComponentProps<typeof Bookmark>["onOpen"];
  onRemoveBookmark: ComponentProps<typeof Bookmark>["onRemove"];
  onOpenDashboardTab: ComponentProps<typeof Dashboard>["onOpenTab"];
  onChangeTabStatus: ComponentProps<typeof Dashboard>["onChangeStatus"];
  onMoveDashboardTabToGroup: ComponentProps<typeof Dashboard>["onMoveToGroup"];
  onToggleDashboardTabPin: ComponentProps<typeof Dashboard>["onToggleTabPin"];
  onToggleDashboardTabBookmark: ComponentProps<
    typeof Dashboard
  >["onToggleTabBookmark"];
  onDeleteDashboardTab: ComponentProps<typeof Dashboard>["onDeleteTab"];
  onCreateGroup: ComponentProps<typeof Group>["onCreate"];
  onSelectGroup: ComponentProps<typeof Group>["onSelect"];
  onRemoveGroup: ComponentProps<typeof Group>["onRemove"];
  onRenameGroup: ComponentProps<typeof Group>["onRename"];
  onMoveGroup: ComponentProps<typeof Group>["onMoveGroup"];
  onToggleGroupPin: ComponentProps<typeof Group>["onTogglePinGroup"];
};
