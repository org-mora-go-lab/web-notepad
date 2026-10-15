import type { ClosedTabEntry } from "@/src/4-entity/notepad";

export type ClosedPreviewProps = {
  entry: ClosedTabEntry;
  searchQuery: string;
  onRestore: (entryId: string) => void;
  onRemove: (entryId: string) => void;
};
