"use client";

import { Ghost, Keyboard, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Theme } from "@/src/3-feature";

type Props = {
  closedCount: number;
  onOpenClosed: () => void;
  onOpenShortcuts: () => void;
};

export function AdditionalTools({ closedCount, onOpenClosed, onOpenShortcuts }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    containerRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
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
        title="MENU"
        aria-label="MENU"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="additional-tools-menu"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <Menu size={20} strokeWidth={1.8} />
        <span className="additional-tools-label">MENU</span>
      </button>
        <div
          hidden={!open}
          className="additional-tools-menu"
          id="additional-tools-menu"
          role="menu"
          aria-label="MENU"
          onKeyDown={(event) => {
            if (!open) return;
            if (event.key === "Escape") {
              event.preventDefault();
              event.stopPropagation();
              close();
            } else if (event.key === "Tab") {
              setOpen(false);
            } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
              event.preventDefault();
              const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>(
                '[role="menuitem"], [role="menuitemradio"]',
              )).filter(item => item.getClientRects().length > 0);
              const index = items.indexOf(document.activeElement as HTMLButtonElement);
              const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1
                : (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
              items[next]?.focus();
            }
          }}
        >
          <Theme key={String(open)} onSelect={close} />
          <button className="closed-command" type="button" role="menuitem"
            aria-controls="closed-panel" aria-label="닫은 탭"
            onClick={() => { close(); onOpenClosed(); }}>
            <Ghost size={16} /><span>CLOSED</span>
            {closedCount > 0 && <span className="closed-count">{closedCount}</span>}
          </button>
          <button className="additional-tools-shortcut" type="button" role="menuitem"
            aria-controls="shortcuts-panel"
            onClick={() => { close(); onOpenShortcuts(); }}>
            <Keyboard size={16} /><span>SHORTCUT</span>
          </button>
        </div>
    </div>
  );
}