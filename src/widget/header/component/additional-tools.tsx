"use client";

import { Keyboard, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Theme } from "@/src/feature";

type Props = { onOpenShortcuts: () => void };

export function AdditionalTools({ onOpenShortcuts }: Props) {
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
          <button className="additional-tools-shortcut" type="button" role="menuitem"
            onClick={() => { setOpen(false); onOpenShortcuts(); }}>
            <Keyboard size={16} /><span>SHORTCUT</span>
          </button>
        </div>
    </div>
  );
}