import type { ComponentProps } from "react";

import type {
  Bookmark,
  Dashboard,
  GlobalSearch,
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
  pinned: boolean;
  onTogglePin: () => void;
  bookmarks: BookmarkEntry[];
  activeGroupTabs: NoteTab[];
  activeTabId?: string;
  tabColorCycle: TabColor[];
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
  onMoveDashboardTabToGroup: ComponentProps<typeof Dashboard>["onMoveToGroup"];
  onToggleDashboardTabPin: ComponentProps<typeof Dashboard>["onToggleTabPin"];
  onToggleDashboardTabBookmark: ComponentProps<
    typeof Dashboard
  >["onToggleTabBookmark"];
  onChangeClosedTabStatus: ComponentProps<
    typeof Dashboard
  >["onChangeClosedStatus"];
  onCreateGroup: ComponentProps<typeof Group>["onCreate"];
  onSelectGroup: ComponentProps<typeof Group>["onSelect"];
  onRemoveGroup: ComponentProps<typeof Group>["onRemove"];
  onRenameGroup: ComponentProps<typeof Group>["onRename"];
  onToggleGroupPin: ComponentProps<typeof Group>["onTogglePinGroup"];
  onRestoreClosedTab: ComponentProps<typeof Dashboard>["onRestoreClosed"];
  onOpenSearchedBookmark: ComponentProps<typeof GlobalSearch>["onOpenBookmark"];
};
