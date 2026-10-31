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
  const swipeClickGuard = useRef<{
    target: Element;
    expiresAt: number;
  } | null>(null);
  const touchActivatedButton = useRef<HTMLButtonElement | null>(null);
  return (
    <footer
      className="footer"
      onClickCapture={(event) => {
        const touchButton = touchActivatedButton.current;
        if (
          touchButton &&
          event.target instanceof Node &&
          touchButton.contains(event.target)
        ) {
          // Touch commands run on pointerup so the first tap after a swipe is
          // never lost to the browser's compatibility-click timing.
          event.preventDefault();
          event.stopPropagation();
          touchActivatedButton.current = null;
          return;
        }
        const guard = swipeClickGuard.current;
        if (!guard) return;
        if (performance.now() > guard.expiresAt) {
          swipeClickGuard.current = null;
          return;
        }
        if (!(event.target instanceof Node)) return;
        const sameSwipeTarget = guard.target.matches("button, a")
          ? guard.target.contains(event.target)
          : event.target === guard.target;
        if (!sameSwipeTarget) return;
        // Suppress only the compatibility click synthesized for the element
        // where the swipe started. A separate click on another icon must run.
        event.preventDefault();
        event.stopPropagation();
        swipeClickGuard.current = null;
      }}
      onPointerDown={(event) => {
        if (!onSwipeTabs || !window.matchMedia("(max-width: 512px)").matches)
          return;
        if (!(event.target instanceof Element)) return;
        touchActivatedButton.current = null;
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
          event.pointerType === "touch" &&
          Math.abs(horizontal) < 10 &&
          Math.abs(vertical) < 10 &&
          event.target instanceof Element
        ) {
          const button = event.target.closest<HTMLButtonElement>(
            ".group-select-command, .dashboard-command",
          );
          if (button) {
            touchActivatedButton.current = button;
            if (button.classList.contains("dashboard-command"))
              onToggleDashboard();
            else onToggleGroups();
          }
          return;
        }
        if (
          Math.abs(horizontal) < 50 ||
          Math.abs(horizontal) <= Math.abs(vertical)
        )
          return;
        if (onSwipeTabs(horizontal < 0 ? "left" : "right") === false) return;
        swipeClickGuard.current = {
          target: start.target.closest("button, a") ?? start.target,
          expiresAt: performance.now() + 700,
        };
      }}
      onPointerCancel={(event) => {
        const start = swipeStart.current;
        swipeStart.current = null;
        touchActivatedButton.current = null;
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
