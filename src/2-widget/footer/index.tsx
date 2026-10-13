"use client";

import { Bookmark, Layers, LayoutDashboard } from "lucide-react";

import { useI18n } from "@/src/5-shared/hook";

type Props = {
  // A linked bookmark was created or synced today.
  hasBookmarkUpdateToday: boolean;
  bookmarksOpen: boolean;
  dashboardOpen: boolean;
  activeGroupName: string;
  groupsOpen: boolean;
  onToggleBookmarks: () => void;
  onToggleDashboard: () => void;
  onToggleGroups: () => void;
};

export function Footer({
  hasBookmarkUpdateToday,
  bookmarksOpen,
  dashboardOpen,
  activeGroupName,
  groupsOpen,
  onToggleBookmarks,
  onToggleDashboard,
  onToggleGroups,
}: Props) {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div className="status-meta">
        <div className="status-controls">
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
              <button
                className={`status-command dashboard-command ${dashboardOpen ? "is-active" : ""}`}
                type="button"
                onClick={onToggleDashboard}
                aria-expanded={dashboardOpen}
                aria-controls="dashboard-panel"
              >
                <span className="status-icon">
                  <LayoutDashboard size={16} strokeWidth={1.8} />
                </span>
                <span className="status-label">{t.dashboard}</span>
              </button>
            </div>
          </div>
          <button
            className={`status-command group-select-command ${groupsOpen ? "is-active" : ""}`}
            type="button"
            onClick={onToggleGroups}
            aria-expanded={groupsOpen}
            aria-haspopup="dialog"
            aria-controls="groups-menu"
            aria-label={`그룹 선택: ${activeGroupName}`}
            title={activeGroupName}
          >
            <Layers size={16} strokeWidth={1.8} />
            <span className="status-label group-select-name" title={activeGroupName}>{activeGroupName}</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
