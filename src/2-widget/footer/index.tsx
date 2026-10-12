"use client";

import { Bookmark, Layers, Search } from "lucide-react";

import { useI18n } from "@/src/5-shared/hook";

type Props = {
  // A linked bookmark was created or synced today.
  hasBookmarkUpdateToday: boolean;
  bookmarksOpen: boolean;
  activeGroupName: string;
  groupsOpen: boolean;
  globalSearchOpen: boolean;
  onToggleBookmarks: () => void;
  onToggleGroups: () => void;
  onToggleGlobalSearch: () => void;
};

export function Footer({
  hasBookmarkUpdateToday,
  bookmarksOpen,
  activeGroupName,
  groupsOpen,
  globalSearchOpen,
  onToggleBookmarks,
  onToggleGroups,
  onToggleGlobalSearch,
}: Props) {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div className="status-meta">
        <div className="status-controls">
          <button
            className={`status-command group-status-command ${groupsOpen ? "is-active" : ""}`}
            type="button"
            onClick={onToggleGroups}
            aria-expanded={groupsOpen}
            aria-controls="groups-panel"
            aria-label={`그룹 선택: ${activeGroupName}`}
            title={activeGroupName}
          >
            <span className="group-status-name" title={activeGroupName}>{activeGroupName}</span>
          </button>
          <button
            className={`status-command global-search-command ${globalSearchOpen ? "is-active" : ""}`}
            type="button"
            onClick={onToggleGlobalSearch}
            aria-expanded={globalSearchOpen}
            aria-controls="global-search-panel"
            aria-label="전체 검색"
          >
            <Search size={16} strokeWidth={1.8} />
            <span className="global-search-label">{t.search}</span>
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
                  {hasBookmarkUpdateToday && (
                    <span className="status-dot" role="img" aria-label="오늘 업데이트됨" />
                  )}
                </span>
                <span className="status-label">{t.bookmark}</span>
                <span className="status-separator" aria-hidden="true">
                  |
                </span>
              </button>
            </div>
          </div>
          <button
            className={`status-command group-select-command ${groupsOpen ? "is-active" : ""}`}
            type="button"
            onClick={onToggleGroups}
            aria-expanded={groupsOpen}
            aria-controls="groups-panel"
            aria-label="그룹 선택"
            title={t.selectGroup}
          >
            <Layers size={16} strokeWidth={1.8} />
            <span className="status-label">{t.group}</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
