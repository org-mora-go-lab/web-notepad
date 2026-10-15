import type { ComponentProps } from "react";

import type {
  Bookmark,
  Dashboard,
  Group,
} from "@/src/3-feature";
import type {
  BookmarkEntry,
  ClosedTabEntry,
  GroupEntry,
  NoteTab,
  TabColor,
} from "@/src/4-entity/notepad";
import type { ViewPanel } from "@/src/5-shared";

export type PanelProps = {
  openPanel: ViewPanel | null;
  backgroundPanel: ViewPanel | null;
  pinned: boolean;
  onTogglePin: () => void;
  bookmarks: BookmarkEntry[];
  activeGroupTabs: NoteTab[];
  activeTabId?: string;
  tabColorCycle: TabColor[];
  dashboardStatusNames: ComponentProps<typeof Dashboard>["statusNames"];
  groups: GroupEntry[];
  activeGroupId: string;
  groupMenuOpen: boolean;
  closedTabs: ClosedTabEntry[];
  globalSearchQuery: string;
  onClose: () => void;
  onCloseGroupMenu: () => void;
  onGlobalSearchQueryChange: (query: string) => void;
  onOpenBookmark: ComponentProps<typeof Bookmark>["onOpen"];
  onRemoveBookmark: ComponentProps<typeof Bookmark>["onRemove"];
  onOpenDashboardTab: ComponentProps<typeof Dashboard>["onOpenTab"];
  onChangeTabStatus: ComponentProps<typeof Dashboard>["onChangeStatus"];
  onRenameDashboardStatus: ComponentProps<typeof Dashboard>["onRenameStatus"];
  onMoveDashboardTabToGroup: ComponentProps<typeof Dashboard>["onMoveToGroup"];
  onToggleDashboardTabPin: ComponentProps<typeof Dashboard>["onToggleTabPin"];
  onToggleDashboardTabBookmark: ComponentProps<
    typeof Dashboard
  >["onToggleTabBookmark"];
  onArchiveDashboardTab: ComponentProps<typeof Dashboard>["onArchiveTab"];
  onRemoveClosedTab: ComponentProps<typeof Dashboard>["onRemoveClosed"];
  onCreateGroup: ComponentProps<typeof Group>["onCreate"];
  onSelectGroup: ComponentProps<typeof Group>["onSelect"];
  onRemoveGroup: ComponentProps<typeof Group>["onRemove"];
  onRenameGroup: ComponentProps<typeof Group>["onRename"];
  onToggleGroupPin: ComponentProps<typeof Group>["onTogglePinGroup"];
  onRestoreClosedTab: ComponentProps<typeof Dashboard>["onRestoreClosed"];
};
