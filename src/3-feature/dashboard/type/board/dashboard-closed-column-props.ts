import type { ClosedTabEntry } from "@/src/4-entity/notepad";

export type DashboardClosedColumnProps = {
  entries: Array<{ entry: ClosedTabEntry; groupName: string }>;
  showGroupNames: boolean;
  onRestore: (entryId: string) => void;
  onRemove: (entryId: string) => void;
};
