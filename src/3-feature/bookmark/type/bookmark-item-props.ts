import type { BookmarkEntry } from "@/src/4-entity/notepad";

export type BookmarkItemProps = {
  bookmark: BookmarkEntry;
  onOpen: (bookmarkId: string) => void;
  onRemove: (bookmarkId: string) => void;
};
