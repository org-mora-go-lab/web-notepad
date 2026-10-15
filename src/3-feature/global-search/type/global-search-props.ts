import type { GroupEntry } from "@/src/4-entity/notepad";

export type GlobalSearchProps = {
  groups: GroupEntry[];
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  open: boolean;
  onClose: () => void;
  onSelectGroup: (groupId: string) => void;
};
