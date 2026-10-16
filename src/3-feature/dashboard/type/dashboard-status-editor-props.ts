import type { DashboardProps } from "./dashboard-props";

export type DashboardStatusEditorProps = Pick<DashboardProps, "statusNames" | "onSaveStatusNames"> & {
  groupName: string;
  onClose: () => void;
};
