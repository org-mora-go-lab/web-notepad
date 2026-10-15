"use client";

import { Search, X } from "lucide-react";
import { useEffect, useId, useRef } from "react";

import { useI18n } from "@/src/5-shared/hook";
import { EmptyState, SearchField } from "@/src/5-shared/ui";
import { matchesSearchQuery } from "@/src/5-shared/util";

import { SearchResult, SearchResultSection } from "./component";
import type { GlobalSearchProps } from "./type";

export function GlobalSearch({
  groups,
  searchQuery,
  onSearchQueryChange,
  open,
  onClose,
  onSelectGroup,
  onOpenBookmark,
}: GlobalSearchProps) {
  const { t } = useI18n();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const query = searchQuery.trim();
  const groupResults = query
    ? groups.filter((group) => matchesSearchQuery(query, group.name))
    : [];
  const bookmarkResults = query
    ? groups.flatMap((group) =>
        group.bookmarks
          .filter((bookmark) =>
            matchesSearchQuery(
              query,
              group.name,
              bookmark.title,
              bookmark.content,
            ),
          )
          .map((bookmark) => ({ group, bookmark })),
      )
    : [];
  const resultCount = groupResults.length + bookmarkResults.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="global-search"
      id="global-search-popup"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="global-search-header">
        <div className="global-search-heading">
          <Search size={20} aria-hidden="true" />
          <h2 id={titleId}>{t.searchTitle}</h2>
        </div>
        <button
          className="global-search-close"
          type="button"
          aria-label={t.closePanel(t.searchTitle)}
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>
      <SearchField
        value={searchQuery}
        ariaLabel={t.searchEverything}
        placeholder={t.searchEverything}
        onChange={onSearchQueryChange}
      />
      <div className="global-search-list">
        {!query ? (
          <EmptyState
            className="global-search-empty-state"
            message={t.enterSearchTerm}
          />
        ) : resultCount === 0 ? (
          <EmptyState
            className="global-search-empty-state"
            message={t.noSearchResults}
          />
        ) : (
          <>
            {groupResults.length > 0 && (
              <SearchResultSection
                title={t.groupsTitle}
                className="global-search-groups"
              >
                {groupResults.map((group) => (
                  <SearchResult
                    key={group.id}
                    category={t.groupCategory}
                    title={group.name}
                    query={query}
                    ariaLabel={t.selectGroupResult(group.name)}
                    onSelect={() => onSelectGroup(group.id)}
                  />
                ))}
              </SearchResultSection>
            )}
            {bookmarkResults.length > 0 && (
              <SearchResultSection
                title={t.bookmarksTitle}
                className="global-search-bookmarks"
              >
                {bookmarkResults.map(({ group, bookmark }) => (
                  <SearchResult
                    key={`${group.id}:${bookmark.id}`}
                    category={t.bookmarkCategory}
                    groupName={group.name}
                    title={bookmark.title}
                    description={bookmark.content}
                    query={query}
                    ariaLabel={t.openBookmarkResult(bookmark.title)}
                    onSelect={() => onOpenBookmark(group.id, bookmark.id)}
                  />
                ))}
              </SearchResultSection>
            )}
          </>
        )}
      </div>
    </dialog>
  );
}
