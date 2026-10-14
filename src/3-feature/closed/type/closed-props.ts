import type { ClosedTabEntry, GroupEntry } from "@/src/4-entity/notepad";

export type ClosedProps = {
  closedTabs: ClosedTabEntry[];
  groups: GroupEntry[];
  searchQuery: string;
  open: boolean;
  pinned: boolean;
  onTogglePin: () => void;
  onClose: () => void;
  onSearchQueryChange: (query: string) => void;
  onRestore: (entryId: string) => void;
  onRemove: (entryId: string) => void;
};
