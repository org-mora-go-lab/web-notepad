"use client";

import {
  BookOpen,
  Ghost,
  Keyboard,
  Menu,
  Search,
  Settings,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Theme, UserGuide } from "@/src/3-feature";
import { useI18n } from "@/src/5-shared/hook";

import type { AdditionalToolsProps } from "../type";

export function AdditionalTools({
  closedCount,
  onOpenClosed,
  onOpenSettings,
  onOpenShortcuts,
  onOpenSearch,
}: AdditionalToolsProps) {
  const [open, setOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    containerRef.current
      ?.querySelector<HTMLButtonElement>('[role="menuitem"]')
      ?.focus();
    const onPointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div className="additional-tools" ref={containerRef}>
      <button
        className="additional-tools-trigger"
        ref={triggerRef}
        type="button"
        title={t.menu}
        aria-label={t.menu}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="additional-tools-menu"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <Menu size={20} strokeWidth={1.8} />
        <span className="additional-tools-label">{t.menu}</span>
      </button>
      <div
        hidden={!open}
        className="additional-tools-menu"
        id="additional-tools-menu"
        role="menu"
        aria-label={t.menu}
        onKeyDown={(event) => {
          if (!open) return;
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            close();
          } else if (event.key === "Tab") {
            setOpen(false);
          } else if (
            ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)
          ) {
            event.preventDefault();
            const items = Array.from(
              event.currentTarget.querySelectorAll<HTMLButtonElement>(
                '[role="menuitem"], [role="menuitemradio"]',
              ),
            ).filter((item) => item.getClientRects().length > 0);
            const index = items.indexOf(
              document.activeElement as HTMLButtonElement,
            );
            const next =
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? items.length - 1
                  : (index +
                      (event.key === "ArrowDown" ? 1 : -1) +
                      items.length) %
                    items.length;
            items[next]?.focus();
          }
        }}
      >
        <Theme key={String(open)} onSelect={close} />
        <button
          className="additional-tools-shortcut"
          type="button"
          role="menuitem"
          aria-controls="shortcuts-panel"
          onClick={() => {
            close();
            onOpenShortcuts();
          }}
        >
          <Keyboard size={16} />
          <span>{t.shortcut}</span>
        </button>
        <button
          className="additional-tools-settings"
          type="button"
          role="menuitem"
          aria-controls="settings-panel"
          aria-label={t.settings}
          onClick={() => {
            close();
            onOpenSettings();
          }}
        >
          <Settings size={16} />
          <span>{t.settings}</span>
        </button>
        <button
          className="additional-tools-guide"
          type="button"
          role="menuitem"
          aria-haspopup="dialog"
          onClick={() => {
            close();
            setGuideOpen(true);
          }}
        >
          <BookOpen size={16} />
          <span>{t.guide}</span>
        </button>
        <button
          className="closed-command"
          type="button"
          role="menuitem"
          aria-controls="closed-panel"
          aria-label={t.closed}
          onClick={() => {
            close();
            onOpenClosed();
          }}
        >
          <Ghost size={16} />
          <span>{t.closed}</span>
          {closedCount > 0 && (
            <span className="closed-count">{closedCount}</span>
          )}
        </button>
        <button
          className="additional-tools-search global-search-command"
          type="button"
          role="menuitem"
          aria-controls="global-search-panel"
          aria-label={t.search}
          onClick={() => {
            close();
            onOpenSearch();
          }}
        >
          <Search size={16} />
          <span className="global-search-label">{t.search}</span>
        </button>
      </div>
      {guideOpen && <UserGuide onClose={() => setGuideOpen(false)} />}
    </div>
  );
}
