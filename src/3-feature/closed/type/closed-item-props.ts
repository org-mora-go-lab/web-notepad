import type { ClosedTabEntry } from "@/src/4-entity/notepad";

export type ClosedItemProps = {
  entry: ClosedTabEntry;
  groupName: string;
  searchQuery: string;
  onRestore: (entryId: string) => void;
  onRemove: (entryId: string) => void;
};
