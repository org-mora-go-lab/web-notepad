import type { DashboardProps } from "./dashboard-props";

export type DashboardOptionsProps = Pick<DashboardProps, "groupId" | "statusNames" | "onSaveStatusNames"> & {
  groupName: string;
  iceboxVisible: boolean;
  closedVisible: boolean;
  onToggleIcebox: () => void;
  onToggleClosed: () => void;
};
