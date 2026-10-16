import type { BookmarkEntry } from "@/src/4-entity/notepad";

export type BookmarkProps = {
  bookmarks: BookmarkEntry[];
  open: boolean;
  onClose: () => void;
  onOpen: (bookmarkId: string) => void;
  onRemove: (bookmarkId: string) => void;
};
