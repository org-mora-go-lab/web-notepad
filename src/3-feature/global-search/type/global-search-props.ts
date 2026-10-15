import type { GroupEntry } from "@/src/4-entity/notepad";

export type GlobalSearchProps = {
  groups: GroupEntry[];
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  open: boolean;
  pinned: boolean;
  onTogglePin: () => void;
  onClose: () => void;
  onSelectGroup: (groupId: string) => void;
  onOpenBookmark: (groupId: string, bookmarkId: string) => void;
};
