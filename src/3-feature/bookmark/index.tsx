"use client";

import { Bookmark as BookmarkIcon } from "lucide-react";

import { useI18n } from "@/src/5-shared/hook";
import { CornerPopover, EmptyState } from "@/src/5-shared/ui";

import { BookmarkItem } from "./component";
import type { BookmarkProps } from "./type";

export function Bookmark({
  groups,
  open,
  onClose,
  onOpen,
  onRemove,
}: BookmarkProps) {
  const { t } = useI18n();
  const bookmarks = groups
    .flatMap((group) =>
      group.bookmarks.map((bookmark) => ({ group, bookmark })),
    )
    .sort((left, right) => right.bookmark.createdAt - left.bookmark.createdAt);

  return (
    <CornerPopover
      className="bookmark"
      id="bookmarks-panel"
      title={t.bookmarksTitle}
      open={open}
      closeLabel={t.closePanel(t.bookmarksTitle)}
      triggerSelector=".group-select-command"
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
          bookmarks.map(({ group, bookmark }) => (
            <BookmarkItem
              key={`${group.id}:${bookmark.id}`}
              bookmark={bookmark}
              groupId={group.id}
              groupName={group.name}
              onOpen={onOpen}
              onRemove={onRemove}
            />
          ))
        )}
      </div>
    </CornerPopover>
  );
}
