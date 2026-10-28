import type { GroupEntry } from "@/src/4-entity/notepad";

export type BookmarkProps = {
  groups: GroupEntry[];
  open: boolean;
  onClose: () => void;
  onOpen: (groupId: string, bookmarkId: string) => void;
  onRemove: (groupId: string, bookmarkId: string) => void;
};
