import type { GroupEntry } from "@/src/4-entity/notepad";

export type TabContextMenuProps = {
  left: number;
  top: number;
  pinned: boolean;
  bookmarked: boolean;
  targetGroups: GroupEntry[];
  onMoveToGroup: (groupId: string) => void;
  onTogglePin: () => void;
  onToggleBookmark: () => void;
  onClose: () => void;
};
