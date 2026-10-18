"use client";

import { Bookmark, Ellipsis, Layers, LayoutDashboard } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!moreOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [moreOpen]);
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
                <span className="status-dot" role="img" aria-label={t.updatedToday} />
              )}
            </span>
            <span className="status-label group-select-name" title={activeGroupName}>
              {t.group}
            </span>
            <span className="status-label group-command-label">{t.group}</span>
            <span className="group-current-value" aria-hidden="true">
              {activeGroupName}
            </span>
          </button>
          <div className="status-scroll-area">
            <div className="status-actions">
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
              <div className="footer-more" ref={moreRef}>
                <button
                  className={`status-command more-command ${moreOpen || bookmarksOpen ? "is-active" : ""}`}
                  type="button"
                  aria-expanded={moreOpen}
                  aria-controls="footer-more-menu"
                  onClick={() => setMoreOpen((current) => !current)}
                >
                  <span className="status-icon">
                    <Ellipsis size={16} strokeWidth={1.8} />
                    {hasBookmarkUpdateToday && (
                      <span className="status-dot" role="img" aria-label={t.updatedToday} />
                    )}
                  </span>
                  <span className="status-label">{t.more}</span>
                </button>
                {moreOpen && (
                  <div className="footer-more-menu" id="footer-more-menu" role="menu">
                    <button
                      className="bookmark-command"
                      type="button"
                      role="menuitem"
                      aria-controls="bookmarks-panel"
                      aria-expanded={bookmarksOpen}
                      onClick={() => {
                        setMoreOpen(false);
                        onToggleBookmarks();
                      }}
                    >
                      <Bookmark size={18} strokeWidth={1.8} />
                      <span className="status-label">{t.bookmark}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
