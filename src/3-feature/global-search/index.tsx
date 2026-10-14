"use client";
import { getClosedTabItems } from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";
import { EmptyState, SearchField, SidePanel } from "@/src/5-shared/ui";
import { matchesSearchQuery } from "@/src/5-shared/util";

import { SearchResult, SearchResultSection } from "./component";
import type { GlobalSearchProps } from "./type";

export function GlobalSearch({
  groups,
  closedTabs,
  searchQuery,
  onSearchQueryChange,
  open,
  pinned,
  onTogglePin,
  onClose,
  onSelectGroup,
  onOpenBookmark,
  onOpenClosedSearch,
}: GlobalSearchProps) {
  const { t } = useI18n();
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
  const closedResults = query
    ? getClosedTabItems(closedTabs, groups).filter(({ entry, groupName }) =>
        matchesSearchQuery(
          query,
          groupName,
          entry.tab.title,
          entry.tab.content,
        ),
      )
    : [];
  const resultCount =
    groupResults.length + bookmarkResults.length + closedResults.length;

  return (
    <SidePanel
      className="global-search"
      id="global-search-panel"
      title={t.searchTitle}
      open={open}
      pinned={pinned}
      onTogglePin={onTogglePin}
      closeLabel="전체 검색 닫기"
      onClose={onClose}
    >
      <SearchField
        value={searchQuery}
        ariaLabel="전체 검색"
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
                    ariaLabel={`그룹 ${group.name} 선택`}
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
                    ariaLabel={`북마크 ${bookmark.title} 열기`}
                    onSelect={() => onOpenBookmark(group.id, bookmark.id)}
                  />
                ))}
              </SearchResultSection>
            )}
            {closedResults.length > 0 && (
              <SearchResultSection
                title={t.closedTitle}
                className="global-search-closed"
              >
                {closedResults.map(({ entry, groupName }) => (
                  <SearchResult
                    key={entry.id}
                    category={t.closedCategory}
                    groupName={groupName}
                    title={entry.tab.title}
                    description={entry.tab.content}
                    query={query}
                    ariaLabel={`닫은 탭 ${entry.tab.title} 검색 결과 보기`}
                    onSelect={() => onOpenClosedSearch(query)}
                  />
                ))}
              </SearchResultSection>
            )}
          </>
        )}
      </div>
    </SidePanel>
  );
}
