"use client";

import {
  Bookmark,
  BookOpen,
  Ellipsis,
  Layers,
  LayoutDashboard,
  Search,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Auth, UserGuide } from "@/src/3-feature";
import { useI18n } from "@/src/5-shared/hook";

import type { FooterProps } from "./type";

export function Footer({
  hasGroupUpdateToday,
  dashboardOpen,
  activeGroupName,
  groupsOpen,
  onToggleDashboard,
  onToggleGroups,
  onOpenShortcuts,
  onToggleBookmarks,
  onToggleSearch,
  searchOpen,
}: FooterProps) {
  const { t } = useI18n();
  const [moreOpen, setMoreOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
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
        <Layers
          className="current-group-icon"
          size={18}
          strokeWidth={1.8}
          aria-hidden="true"
        />
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
                <span
                  className="status-dot"
                  role="img"
                  aria-label={t.updatedToday}
                />
              )}
            </span>
            <span className="status-label group-command-label">{t.group}</span>
            <span className="group-current-value" aria-hidden="true">
              {activeGroupName}
            </span>
          </button>
          <div className="status-scroll-area">
            <div className="status-actions">
              <div className="footer-more" ref={moreRef}>
                <button
                  className={`status-command more-command ${moreOpen || searchOpen ? "is-active" : ""}`}
                  type="button"
                  aria-expanded={moreOpen}
                  aria-controls="footer-more-menu"
                  onClick={() => {
                    setMoreOpen((current) => !current);
                  }}
                >
                  <span className="status-icon">
                    <Ellipsis size={16} strokeWidth={1.8} />
                  </span>
                  <span className="status-label">{t.more}</span>
                </button>
                {moreOpen && (
                  <div
                    className="footer-more-menu"
                    id="footer-more-menu"
                    role="menu"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setMoreOpen(false);
                        setGuideOpen(true);
                      }}
                    >
                      <BookOpen size={18} strokeWidth={1.8} />
                      <span className="status-label">{t.guide}</span>
                    </button>
                    <button
                      className="global-search-command"
                      type="button"
                      aria-expanded={searchOpen}
                      aria-controls="global-search-popup"
                      aria-haspopup="dialog"
                      onClick={() => {
                        setMoreOpen(false);
                        onToggleSearch();
                      }}
                    >
                      <Search size={18} strokeWidth={1.8} />
                      <span className="status-label">{t.search}</span>
                    </button>
                    <button
                      type="button"
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
              <div className="footer-auth">
                <Auth />
              </div>
            </div>
          </div>
        </div>
      </div>
      {guideOpen && (
        <UserGuide
          onClose={() => setGuideOpen(false)}
          onOpenShortcuts={() => {
            setGuideOpen(false);
            onOpenShortcuts();
          }}
        />
      )}
    </footer>
  );
}
