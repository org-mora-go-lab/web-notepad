"use client";

import { Bookmark as BookmarkIcon, Trash2 } from "lucide-react";

import { useI18n } from "@/src/5-shared/hook";
import { formatDate } from "@/src/5-shared/util";

import type { BookmarkItemProps } from "../type";

// Drops the first line when the heading already shows it as the title.
const getBodyWithoutTitle = (content: string, title: string) => {
  const lines = content.split("\n");
  const titleIndex = lines.findIndex((line) => line.trim());
  if (titleIndex < 0 || lines[titleIndex].trim() !== title) return content;

  return lines
    .slice(titleIndex + 1)
    .join("\n")
    .replace(/^\s*\n/, "");
};

export function BookmarkItem({
  bookmark,
  groupId,
  groupName,
  onOpen,
  onRemove,
}: BookmarkItemProps) {
  const { t } = useI18n();
  const body = bookmark.content
    ? getBodyWithoutTitle(bookmark.content, bookmark.title)
    : t.emptyNote;

  return (
    <article className="bookmark-item">
      <div className="bookmark-item-heading">
        <strong>{bookmark.title}</strong>
        <time dateTime={new Date(bookmark.createdAt).toISOString()}>
          {formatDate(bookmark.createdAt)}
        </time>
      </div>
      <span className="bookmark-item-group">{groupName}</span>
      {body.trim() ? (
        <p className="bookmark-item-content">{body}</p>
      ) : (
        <p className="bookmark-item-content is-empty" aria-hidden="true" />
      )}
      <div className="bookmark-actions">
        <button type="button" onClick={() => onOpen(groupId, bookmark.id)}>
          <BookmarkIcon size={14} />
          {t.open}
        </button>
        <button
          className="remove-bookmark"
          type="button"
          onClick={() => onRemove(groupId, bookmark.id)}
          aria-label={t.removeBookmarkFor(bookmark.title)}
          title={t.removeBookmark}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </article>
  );
}
