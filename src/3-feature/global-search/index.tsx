"use client";

import { Search, X } from "lucide-react";
import { useId, useState } from "react";

import { useI18n, useScrollableListLayout } from "@/src/5-shared/hook";
import { EmptyState, SearchField } from "@/src/5-shared/ui";
import { matchesSearchQuery } from "@/src/5-shared/util";

import { SearchPreview, SearchResult, SearchResultSection } from "./component";
import { useDebouncedSearchQuery, useSearchPopover } from "./hook";
import type { GlobalSearchProps } from "./type";

export function GlobalSearch({
  groups,
  searchQuery,
  onSearchQueryChange,
  open,
  onClose,
  onSelectGroup,
  onSelectTab,
}: GlobalSearchProps) {
  const { t } = useI18n();
  const titleId = useId();
  const [selectedBookmarkId, setSelectedBookmarkId] = useState<string | null>(
    null,
  );
  const { containerRef, listRef } = useScrollableListLayout(
    "--global-search-scrollbar-width",
  );
  const query = useDebouncedSearchQuery(searchQuery).trim();
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
  const tabResults = query
    ? groups.flatMap((group) =>
        group.tabs
          .filter((tab) => matchesSearchQuery(query, tab.title, tab.content))
          .map((tab) => ({ group, tab })),
      )
    : [];
  const resultCount =
    groupResults.length + bookmarkResults.length + tabResults.length;
  const selectedBookmark = bookmarkResults.find(
    ({ group, bookmark }) =>
      `${group.id}:${bookmark.id}` === selectedBookmarkId,
  );
  const closeSearch = () => {
    setSelectedBookmarkId(null);
    onClose();
  };
  const dialogRef = useSearchPopover(open, closeSearch);

  return (
    <dialog
      ref={dialogRef}
      className={`global-search ${query ? "has-query" : ""} ${selectedBookmark ? "has-preview" : ""}`}
      id="global-search-popup"
      aria-labelledby={titleId}
      aria-modal={open ? "true" : "false"}
      onCancel={(event) => {
        event.preventDefault();
        closeSearch();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeSearch();
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
          onClick={closeSearch}
        >
          <X size={18} />
        </button>
      </div>
      <div className="global-search-body">
        <div className="global-search-results-pane" ref={containerRef}>
          <SearchField
            value={searchQuery}
            ariaLabel={t.searchEverything}
            placeholder={t.searchEverything}
            onChange={onSearchQueryChange}
          />
          <div className="global-search-list" ref={listRef}>
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
                        selected={
                          selectedBookmarkId === `${group.id}:${bookmark.id}`
                        }
                        ariaLabel={t.previewBookmarkResult(bookmark.title)}
                        onSelect={() =>
                          setSelectedBookmarkId(`${group.id}:${bookmark.id}`)
                        }
                      />
                    ))}
                  </SearchResultSection>
                )}
                {tabResults.length > 0 && (
                  <SearchResultSection
                    title={t.tabsTitle}
                    className="global-search-tabs"
                  >
                    {tabResults.map(({ group, tab }) => (
                      <SearchResult
                        key={group.id + ":" + tab.id}
                        kind="tab"
                        category={t.tabCategory}
                        groupName={group.name}
                        title={tab.title || t.emptyNote}
                        description={tab.content}
                        query={query}
                        ariaLabel={t.openTabResult(tab.title || t.emptyNote)}
                        onSelect={() => onSelectTab(group.id, tab.id)}
                      />
                    ))}
                  </SearchResultSection>
                )}
              </>
            )}
          </div>
        </div>
        <div className="global-search-preview-pane">
          {selectedBookmark ? (
            <SearchPreview
              groupName={selectedBookmark.group.name}
              bookmark={selectedBookmark.bookmark}
              query={query}
            />
          ) : (
            <EmptyState
              className="global-search-preview-empty"
              message={t.searchPreview}
            />
          )}
        </div>
      </div>
    </dialog>
  );
}
