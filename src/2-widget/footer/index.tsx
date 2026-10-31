"use client";

import { Layers, LayoutDashboard } from "lucide-react";
import { useRef } from "react";

import { Auth } from "@/src/3-feature";
import { useI18n } from "@/src/5-shared/hook";

import type { FooterProps } from "./type";

export function Footer({
  hasGroupUpdateToday,
  dashboardOpen,
  activeGroupName,
  groupsOpen,
  onSwipeTabs,
  onToggleDashboard,
  onToggleGroups,
}: FooterProps) {
  const { t } = useI18n();
  const swipeStart = useRef<{
    x: number;
    y: number;
    pointerId: number;
    target: Element;
  } | null>(null);
  const suppressClick = useRef(false);
  return (
    <footer
      className="footer"
      onClickCapture={(event) => {
        if (!suppressClick.current) return;
        event.preventDefault();
        event.stopPropagation();
        suppressClick.current = false;
      }}
      onPointerDown={(event) => {
        if (!onSwipeTabs || !window.matchMedia("(max-width: 512px)").matches)
          return;
        if (!(event.target instanceof Element)) return;
        // A new pointer gesture is an intentional tap, so it must not inherit
        // the synthetic-click guard from the preceding swipe.
        suppressClick.current = false;
        swipeStart.current = {
          x: event.clientX,
          y: event.clientY,
          pointerId: event.pointerId,
          target: event.target,
        };
        event.target.setPointerCapture(event.pointerId);
      }}
      onPointerUp={(event) => {
        const start = swipeStart.current;
        swipeStart.current = null;
        if (start?.target.hasPointerCapture(event.pointerId))
          start.target.releasePointerCapture(event.pointerId);
        if (!start || start.pointerId !== event.pointerId || !onSwipeTabs)
          return;
        const horizontal = event.clientX - start.x;
        const vertical = event.clientY - start.y;
        if (
          Math.abs(horizontal) < 50 ||
          Math.abs(horizontal) <= Math.abs(vertical)
        )
          return;
        if (onSwipeTabs(horizontal < 0 ? "left" : "right") === false) return;
        // Suppress only the click synthesized from this swipe. A real next tap
        // clears the guard in pointerdown before its click is delivered.
        suppressClick.current = true;
      }}
      onPointerCancel={(event) => {
        const start = swipeStart.current;
        swipeStart.current = null;
        suppressClick.current = false;
        if (start?.target.hasPointerCapture(event.pointerId))
          start.target.releasePointerCapture(event.pointerId);
      }}
    >
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
            <span className="status-label group-command-label">{t.menu}</span>
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
              <div className="footer-auth">
                <Auth />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
