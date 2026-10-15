import type { ClosedTabEntry } from "@/src/4-entity/notepad";

export type ClosedProps = {
  entries: ClosedTabEntry[];
  open: boolean;
  pinned: boolean;
  onTogglePin: () => void;
  onClose: () => void;
  onRestore: (entryId: string) => void;
  onRemove: (entryId: string) => void;
};
