"use client";

import { Bookmark as BookmarkIcon } from "lucide-react";

import { useI18n } from "@/src/5-shared/hook";
import { EmptyState, SidePanel } from "@/src/5-shared/ui";

import { BookmarkItem } from "./component";
import type { BookmarkProps } from "./type";

export function Bookmark({
  bookmarks,
  open,
  pinned,
  onTogglePin,
  onClose,
  onOpen,
  onRemove,
}: BookmarkProps) {
  const { t } = useI18n();

  return (
    <SidePanel
      className="bookmark"
      id="bookmarks-panel"
      title={t.bookmarksTitle}
      open={open}
      pinned={pinned}
      onTogglePin={onTogglePin}
      closeLabel={t.closePanel(t.bookmarksTitle)}
      ariaLabel={t.bookmarksTitle}
      onClose={onClose}
    >
      <div className="bookmark-list">
        {bookmarks.length === 0 ? (
          <EmptyState
            className="bookmark-empty"
            icon={<BookmarkIcon size={26} strokeWidth={1.4} />}
            message={t.emptyBookmarks}
          />
        ) : (
          bookmarks.map((bookmark) => (
            <BookmarkItem
              key={bookmark.id}
              bookmark={bookmark}
              onOpen={onOpen}
              onRemove={onRemove}
            />
          ))
        )}
      </div>
    </SidePanel>
  );
}
