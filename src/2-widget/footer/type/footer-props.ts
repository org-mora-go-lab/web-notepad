export type FooterProps = {
  // A group was created or changed today.
  hasGroupUpdateToday: boolean;
  dashboardOpen: boolean;
  activeGroupName: string;
  groupsOpen: boolean;
  onToggleDashboard: () => void;
  onToggleGroups: () => void;
  onOpenShortcuts: () => void;
  onToggleBookmarks: () => void;
  onToggleSearch: () => void;
  searchOpen: boolean;
};
