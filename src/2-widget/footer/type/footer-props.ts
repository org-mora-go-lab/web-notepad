export type FooterProps = {
  // A group was created or changed today.
  hasGroupUpdateToday: boolean;
  dashboardOpen: boolean;
  activeGroupName: string;
  groupsOpen: boolean;
  onSwipeTabs?: (direction: "left" | "right") => void;
  onToggleDashboard: () => void;
  onToggleGroups: () => void;
};
