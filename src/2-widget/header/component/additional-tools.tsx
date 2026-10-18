"use client";

import { BookOpen, Menu, Search, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Auth, UserGuide } from "@/src/3-feature";
import { useI18n } from "@/src/5-shared/hook";

import type { AdditionalToolsProps } from "../type";

export function AdditionalTools({
  onOpenSettings,
  onOpenShortcuts,
  onToggleSearch,
  searchOpen,
}: AdditionalToolsProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="additional-tools" ref={rootRef}>
      <button
        className="additional-tools-trigger"
        ref={triggerRef}
        type="button"
        aria-label={t.menu}
        title={t.menu}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls="additional-tools-menu"
        onClick={() => setOpen((current) => !current)}
      >
        <Menu aria-hidden="true" />
      </button>
      {open && (
        <div className="additional-tools-menu" id="additional-tools-menu" role="dialog" aria-label={t.menu}>
          <button type="button" onClick={() => { setOpen(false); setGuideOpen(true); }}>
            <BookOpen aria-hidden="true" />
            <span>{t.guide}</span>
          </button>
          <button type="button" onClick={() => { setOpen(false); onOpenSettings(); }}>
            <Settings aria-hidden="true" />
            <span>{t.settings}</span>
          </button>
          <button
            className="global-search-command"
            type="button"
            aria-expanded={searchOpen}
            aria-controls="global-search-popup"
            aria-haspopup="dialog"
            onClick={onToggleSearch}
          >
            <Search aria-hidden="true" />
            <span>{t.search}</span>
          </button>
          <Auth />
        </div>
      )}
      {guideOpen && (
        <UserGuide
          onClose={() => setGuideOpen(false)}
          onOpenShortcuts={() => { setGuideOpen(false); onOpenShortcuts(); }}
        />
      )}
    </div>
  );
}
