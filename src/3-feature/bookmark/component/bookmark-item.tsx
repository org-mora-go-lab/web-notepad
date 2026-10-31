"use client";

import { Trash2 } from "lucide-react";

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
      <button
        type="button"
        className="bookmark-item-open"
        aria-label={t.openBookmarkResult(bookmark.title)}
        onClick={() => onOpen(groupId, bookmark.id)}
      >
        <span className="bookmark-item-heading">
          <strong>{bookmark.title}</strong>
          <time dateTime={new Date(bookmark.createdAt).toISOString()}>
            {formatDate(bookmark.createdAt)}
          </time>
        </span>
        <span className="bookmark-item-group">{groupName}</span>
        {body.trim() ? (
          <span className="bookmark-item-content">{body}</span>
        ) : (
          <span className="bookmark-item-content is-empty" aria-hidden="true" />
        )}
      </button>
      <div className="bookmark-actions">
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
