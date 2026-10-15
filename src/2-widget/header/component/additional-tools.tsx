"use client";

import {
  BookOpen,
  FolderOpen,
  Keyboard,
  Layers3,
  Menu,
  Settings,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Theme, UserGuide } from "@/src/3-feature";
import {
  ALL_GROUP_ID,
  ALL_GROUP_NAME,
  UNGROUPED_GROUP_ID,
} from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";

import type { AdditionalToolsProps } from "../type";

export function AdditionalTools({
  onOpenSettings,
  onOpenShortcuts,
  onSelectGroup,
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
        <Theme />
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
        <div className="additional-tools-divider" role="separator" />
        <button
          className="additional-tools-all-group"
          type="button"
          role="menuitem"
          onClick={() => {
            close();
            onSelectGroup(ALL_GROUP_ID);
          }}
        >
          <Layers3 size={16} />
          <span>{ALL_GROUP_NAME}</span>
        </button>
        <button
          className="additional-tools-ungrouped"
          type="button"
          role="menuitem"
          onClick={() => {
            close();
            onSelectGroup(UNGROUPED_GROUP_ID);
          }}
        >
          <FolderOpen size={16} />
          <span>Ungrouped</span>
        </button>
      </div>
      {guideOpen && <UserGuide onClose={() => setGuideOpen(false)} />}
    </div>
  );
}
