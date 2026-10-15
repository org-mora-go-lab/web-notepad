import type { BookmarkEntry } from "@/src/4-entity/notepad";

export type SearchPreviewProps = {
  groupName: string;
  bookmark: BookmarkEntry;
  query: string;
};
