"use client";

import { Bookmark, Layers, LayoutDashboard, Search } from "lucide-react";

import { useI18n } from "@/src/5-shared/hook";

import type { FooterProps } from "./type";

export function Footer({
  hasBookmarkUpdateToday,
  bookmarksOpen,
  searchOpen,
  dashboardOpen,
  activeGroupName,
  groupsOpen,
  onToggleBookmarks,
  onToggleSearch,
  onToggleDashboard,
  onToggleGroups,
}: FooterProps) {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div className="current-group-panel" title={activeGroupName}>
        <span className="current-group-name" title={activeGroupName}>
          {activeGroupName}
        </span>
      </div>
      <div className="status-meta">
        <div className="status-controls">
          <div className="status-scroll-area">
            <div className="status-actions">
              <button
                className={`status-command global-search-command ${searchOpen ? "is-active" : ""}`}
                type="button"
                onClick={onToggleSearch}
                aria-expanded={searchOpen}
                aria-controls="global-search-popup"
                aria-haspopup="dialog"
                aria-label={t.search}
              >
                <span className="status-icon">
                  <Search size={16} strokeWidth={1.8} />
                </span>
                <span className="status-label">{t.search}</span>
              </button>
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
                    <span
                      className="status-dot"
                      role="img"
                      aria-label={t.updatedToday}
                    />
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
            aria-label={t.selectGroupNamed(activeGroupName)}
            title={activeGroupName}
          >
            <Layers size={16} strokeWidth={1.8} />
            <span
              className="status-label group-select-name"
              title={activeGroupName}
            >
              {activeGroupName}
            </span>
            <span className="status-label group-command-label">{t.group}</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
