import type { BookmarkEntry } from "@/src/4-entity/notepad";

export type BookmarkItemProps = {
  bookmark: BookmarkEntry;
  groupId: string;
  groupName: string;
  onOpen: (groupId: string, bookmarkId: string) => void;
  onRemove: (groupId: string, bookmarkId: string) => void;
};
