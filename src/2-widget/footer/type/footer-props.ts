export type FooterProps = {
  // A linked bookmark was created or synced today.
  hasBookmarkUpdateToday: boolean;
  bookmarksOpen: boolean;
  dashboardOpen: boolean;
  activeGroupName: string;
  groupsOpen: boolean;
  onToggleBookmarks: () => void;
  onToggleDashboard: () => void;
  onToggleGroups: () => void;
};
