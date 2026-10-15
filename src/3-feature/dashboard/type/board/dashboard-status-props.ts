import type { TabColor, TabStatus } from "@/src/4-entity/notepad";

export type DashboardStatusProps = {
  id?: string;
  className?: string;
  status: TabStatus;
  label: string;
  count: number;
  tabColor: TabColor;
  onRename: (status: TabStatus, name: string) => void;
};
