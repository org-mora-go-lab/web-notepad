"use client";

import { Bookmark, Layers, Search } from "lucide-react";

type Props = {
  bookmarkCount: number;
  bookmarksOpen: boolean;
  activeGroupName: string;
  groupsOpen: boolean;
  globalSearchOpen: boolean;
  onToggleBookmarks: () => void;
  onToggleGroups: () => void;
  onToggleGlobalSearch: () => void;
};

export function Footer({
  bookmarkCount,
  bookmarksOpen,
  activeGroupName,
  groupsOpen,
  globalSearchOpen,
  onToggleBookmarks,
  onToggleGroups,
  onToggleGlobalSearch,
}: Props) {
  return (
    <footer className="footer">
      <div className="status-meta">
        <div className="status-controls">
          <button
            className={`status-command global-search-command ${globalSearchOpen ? "is-active" : ""}`}
            type="button"
            onClick={onToggleGlobalSearch}
            aria-expanded={globalSearchOpen}
            aria-controls="global-search-panel"
            aria-label="전체 검색"
          >
            <Search size={16} strokeWidth={1.8} />
            <span className="global-search-label">SEARCH</span>
            <span className="status-separator" aria-hidden="true">
              |
            </span>
          </button>
          <div className="status-scroll-area">
            <div className="status-actions">
              <button
                className={`status-command bookmark-command ${bookmarksOpen ? "is-active" : ""}`}
                type="button"
                onClick={onToggleBookmarks}
                aria-expanded={bookmarksOpen}
                aria-controls="bookmarks-panel"
              >
                <span className="status-icon">
                  <Bookmark size={16} strokeWidth={1.8} />
                  {bookmarkCount > 0 && (
                    <span className="status-count">{bookmarkCount}</span>
                  )}
                </span>
                <span className="status-label">BOOKMARK</span>
                <span className="status-separator" aria-hidden="true">
                  |
                </span>
              </button>
            </div>
          </div>
          <button
            className={`status-command group-status-command ${groupsOpen ? "is-active" : ""}`}
            type="button"
            onClick={onToggleGroups}
            aria-expanded={groupsOpen}
            aria-controls="groups-panel"
            aria-label={`그룹 선택: ${activeGroupName}`}
            title={activeGroupName}
          >
            <span className="status-icon">
              <Layers size={16} strokeWidth={1.8} />
            </span>
            <span className="group-status-name" title={activeGroupName}>{activeGroupName}</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
