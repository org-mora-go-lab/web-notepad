import type { SharedNotification } from "@/src/4-entity/notepad";

export type FooterProps = {
  // A group was created or changed today.
  hasGroupUpdateToday: boolean;
  dashboardOpen: boolean;
  activeGroupName: string;
  groupsOpen: boolean;
  onToggleDashboard: () => void;
  onToggleGroups: () => void;
  onOpenBoard: () => void;
  onOpenShortcuts: () => void;
  onToggleBookmarks: () => void;
  onToggleSearch: () => void;
  searchOpen: boolean;
  notificationsOpen: boolean;
  onNotificationsOpenChange: (open: boolean) => void;
  notifications: SharedNotification[];
  onOpenNotification: (notification: SharedNotification) => void;
};
