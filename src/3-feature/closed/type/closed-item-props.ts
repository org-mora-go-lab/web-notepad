import type { ClosedTabEntry } from "@/src/4-entity/notepad";

export type ClosedItemProps = {
  entry: ClosedTabEntry;
  searchQuery: string;
  selected: boolean;
  onSelect: () => void;
};
