"use client";

import { Bookmark as BookmarkIcon, Trash2 } from "lucide-react";

import type { BookmarkEntry } from "@/src/entity/notepad";
import { SearchHighlight } from "@/src/entity/ui/search-field/component";
import { formatDate } from "@/src/entity/util";

type Props = {
  bookmark: BookmarkEntry;
  searchQuery: string;
  onOpen: (bookmarkId: string) => void;
  onRemove: (bookmarkId: string) => void;
};

// Drops the first line when the heading already shows it as the title.
const getBodyWithoutTitle = (content: string, title: string) => {
  const lines = content.split("\n");
  const titleIndex = lines.findIndex((line) => line.trim());
  if (titleIndex < 0 || lines[titleIndex].trim() !== title) return content;

  return lines.slice(titleIndex + 1).join("\n").replace(/^\s*\n/, "");
};

export function BookmarkItem({ bookmark, searchQuery, onOpen, onRemove }: Props) {
  const body = bookmark.content
    ? getBodyWithoutTitle(bookmark.content, bookmark.title)
    : "Empty note";

  return (
    <article className="bookmark-item">
      <div className="bookmark-item-heading">
        <strong>
          <SearchHighlight text={bookmark.title} query={searchQuery} />
        </strong>
        <time dateTime={new Date(bookmark.createdAt).toISOString()}>
          {formatDate(bookmark.createdAt)}
        </time>
      </div>
      {body.trim() ? (
        <p className="bookmark-item-content">
          <SearchHighlight text={body} query={searchQuery} />
        </p>
      ) : (
        <p className="bookmark-item-content is-empty" aria-hidden="true" />
      )}
      <div className="bookmark-actions">
        <button type="button" onClick={() => onOpen(bookmark.id)}>
          <BookmarkIcon size={14} />
          열기
        </button>
        <button
          className="remove-bookmark"
          type="button"
          onClick={() => onRemove(bookmark.id)}
          aria-label={`${bookmark.title} 북마크 제거`}
          title="북마크 제거"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </article>
  );
}
