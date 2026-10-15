import type { ClosedTabEntry } from "@/src/4-entity/notepad";

export type ClosedItemProps = {
  entry: ClosedTabEntry;
  searchQuery: string;
  onRestore: (entryId: string) => void;
  onMoveToTodo: (entryId: string) => void;
  onRemove: (entryId: string) => void;
};
