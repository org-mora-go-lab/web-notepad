"use client";

import { Bookmark as BookmarkIcon } from "lucide-react";

import { useI18n } from "@/src/5-shared/hook";
import { CornerPopover, EmptyState } from "@/src/5-shared/ui";

import { BookmarkItem } from "./component";
import type { BookmarkProps } from "./type";

export function Bookmark({
  bookmarks,
  open,
  onClose,
  onOpen,
  onRemove,
}: BookmarkProps) {
  const { t } = useI18n();

  return (
    <CornerPopover
      className="bookmark"
      id="bookmarks-panel"
      title={t.bookmarksTitle}
      open={open}
      closeLabel={t.closePanel(t.bookmarksTitle)}
      position="bottom"
      triggerSelector=".footer .more-command"
      outsideIgnoreSelector="#footer-more-menu"
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
    </CornerPopover>
  );
}
