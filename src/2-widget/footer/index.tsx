"use client";

import { Bookmark, Layers, LayoutDashboard } from "lucide-react";

import { useI18n } from "@/src/5-shared/hook";

import type { FooterProps } from "./type";

export function Footer({
  hasBookmarkUpdateToday,
  hasGroupUpdateToday,
  bookmarksOpen,
  dashboardOpen,
  activeGroupName,
  groupsOpen,
  onToggleBookmarks,
  onToggleDashboard,
  onToggleGroups,
}: FooterProps) {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div className="current-group-panel" title={activeGroupName}>
        <Layers className="current-group-icon" size={18} strokeWidth={1.8} aria-hidden="true" />
        <span className="current-group-name" title={activeGroupName}>
          {activeGroupName}
        </span>
      </div>
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
            aria-label={t.toggleSidebar}
            title={t.sidebarTitle}
          >
            <span className="status-icon">
              <Layers size={16} strokeWidth={1.8} />
              {hasGroupUpdateToday && (
                <span
                  className="status-dot"
                  role="img"
                  aria-label={t.updatedToday}
                />
              )}
            </span>
            <span
              className="status-label group-select-name"
              title={activeGroupName}
            >
              {t.group}
            </span>
            <span className="status-label group-command-label">{t.group}</span>
            <span className="group-current-value" aria-hidden="true">
              {activeGroupName}
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
