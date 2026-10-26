"use client";

import { Bookmark, BookOpen, Ellipsis, Layers, LayoutDashboard, MessageSquare, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { UserGuide } from "@/src/3-feature";
import { useI18n } from "@/src/5-shared/hook";

import type { FooterProps } from "./type";

export function Footer({
  hasGroupUpdateToday,
  dashboardOpen,
  activeGroupName,
  groupsOpen,
  onToggleDashboard,
  onToggleGroups,
  onOpenBoard,
  onOpenShortcuts,
  onToggleBookmarks,
  onToggleSearch,
  searchOpen,
  notificationsOpen,
  onNotificationsOpenChange: setNotificationsOpen,
  notifications,
  onOpenNotification,
}: FooterProps) {
  const { t } = useI18n();
  const [moreOpen, setMoreOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLElement>(null);
  const notificationsTriggerRef = useRef<HTMLElement | null>(null);
  const closeNotifications = useCallback(() => {
    setNotificationsOpen(false);
    const trigger = notificationsTriggerRef.current;
    if (trigger?.isConnected) trigger.focus();
    else moreRef.current?.querySelector<HTMLButtonElement>(".more-command")?.focus();
  }, [setNotificationsOpen]);
  useEffect(() => {
    if (!notificationsOpen) return;
    const trigger = document.activeElement;
    notificationsTriggerRef.current = trigger instanceof HTMLElement && trigger.matches("button.auth-command")
      ? trigger : moreRef.current?.querySelector<HTMLButtonElement>(".more-command") ?? null;
    notificationsRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const closeOutside = (event: PointerEvent) => {
      if (!moreRef.current?.contains(event.target as Node)) setNotificationsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeNotifications();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape, true);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape, true);
    };
  }, [closeNotifications, notificationsOpen, setNotificationsOpen]);
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
                  className={`status-command more-command ${moreOpen || searchOpen ? "is-active" : ""}`}
                  type="button"
                  aria-expanded={moreOpen}
                  aria-controls="footer-more-menu"
                  onClick={() => { setNotificationsOpen(false); setMoreOpen((current) => !current); }}
                >
                  <span className="status-icon">
                    <Ellipsis size={16} strokeWidth={1.8} />
                  </span>
                  <span className="status-label">{t.more}</span>
                </button>
                {moreOpen && (
                  <div className="footer-more-menu" id="footer-more-menu" role="menu">
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
                    <button type="button" className="board-command" aria-controls="board-panel" onClick={() => { setMoreOpen(false); onOpenBoard(); }}>
                      <MessageSquare size={18} strokeWidth={1.8} />
                      <span className="status-label">{t.board}</span>
                    </button>
                  </div>
                )}
                {notificationsOpen && <section ref={notificationsRef} className="footer-notifications-panel" id="footer-notifications-panel" role="dialog" aria-label={t.notifications}>
                  <header><strong>{t.notifications}</strong><button type="button" onClick={closeNotifications} aria-label={t.close}><X size={16} /></button></header>
                  {notifications.length === 0 ? <p>{t.noNotifications}</p> : <ul>
                    {notifications.map((item) => <li key={item.id}>
                      <button type="button" className="notification-entry" onClick={() => { setNotificationsOpen(false); onOpenNotification(item); }}>
                      <strong>{item.actorName}</strong> · {item.groupName}
                      <span>{item.summary}</span>
                      <time dateTime={new Date(item.createdAt).toISOString()}>{new Date(item.createdAt).toLocaleString()}</time>
                      </button>
                    </li>)}
                  </ul>}
                </section>}
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
