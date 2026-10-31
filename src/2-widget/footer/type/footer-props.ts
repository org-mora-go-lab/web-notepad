export type FooterProps = {
  // A group was created or changed today.
  hasGroupUpdateToday: boolean;
  dashboardOpen: boolean;
  activeGroupName: string;
  groupsOpen: boolean;
  onSwipeTabs?: (direction: "left" | "right") => boolean | void;
  onToggleDashboard: () => void;
  onToggleGroups: () => void;
};
