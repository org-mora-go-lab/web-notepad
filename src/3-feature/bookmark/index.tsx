"use client";

import { Bookmark as BookmarkIcon } from "lucide-react";
import { useState } from "react";

import type { BookmarkEntry } from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";
import { SearchField, SidePanel } from "@/src/5-shared/ui";
import { matchesSearchQuery } from "@/src/5-shared/ui/search-field/util";

import { BookmarkItem } from "./component";

type Props = {
  bookmarks: BookmarkEntry[];
  open: boolean;
  pinned: boolean;
  onTogglePin: () => void;
  onClose: () => void;
  onOpen: (bookmarkId: string) => void;
  onRemove: (bookmarkId: string) => void;
};

export function Bookmark({
  bookmarks,
  open,
  pinned,
  onTogglePin,
  onClose,
  onOpen,
  onRemove,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useI18n();
  const filteredBookmarks = bookmarks.filter((bookmark) =>
    matchesSearchQuery(searchQuery, bookmark.title, bookmark.content),
  );

  return (
    <SidePanel
      className="bookmark"
      id="bookmarks-panel"
      title={t.bookmarksTitle}
      open={open}
      pinned={pinned}
      onTogglePin={onTogglePin}
      closeLabel="북마크 닫기"
      onClose={onClose}
    >
      <SearchField
        value={searchQuery}
        ariaLabel="북마크 검색"
        placeholder={t.searchBookmarks}
        onChange={setSearchQuery}
      />
      <div className="bookmark-list">
        {bookmarks.length === 0 ? (
          <div className="bookmark-empty">
            <BookmarkIcon size={26} strokeWidth={1.4} />
            <p>{t.emptyBookmarks}</p>
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <div className="search-empty-state">
            <p>{t.noSearchResults}</p>
          </div>
        ) : (
          filteredBookmarks.map((bookmark) => (
            <BookmarkItem
              key={bookmark.id}
              bookmark={bookmark}
              searchQuery={searchQuery}
              onOpen={onOpen}
              onRemove={onRemove}
            />
          ))
        )}
      </div>
    </SidePanel>
  );
}
