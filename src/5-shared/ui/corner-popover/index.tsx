"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import type { CornerPopoverProps } from "./type";

export function CornerPopover({ id, className, title, closeLabel, open, position, triggerSelector, outsideIgnoreSelector, onClose, children }: CornerPopoverProps) {
  const ref = useRef<HTMLElement>(null);
  const closeRef = useRef(onClose);
  const triggerRef = useRef<HTMLElement | null>(null);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  const restoreFocus = () => { if (triggerRef.current?.isConnected) triggerRef.current.focus(); };
  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.querySelector<HTMLElement>(triggerSelector);
    ref.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!ref.current?.contains(target) && !triggerRef.current?.contains(target) && !(outsideIgnoreSelector && event.target instanceof Element && event.target.closest(outsideIgnoreSelector))) closeRef.current();
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.isComposing || document.querySelector("dialog[open]")) return;
      event.preventDefault(); event.stopImmediatePropagation(); closeRef.current(); restoreFocus();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape, true);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape, true); };
  }, [open, triggerSelector, outsideIgnoreSelector]);
  if (typeof document === "undefined") return null;
  return createPortal(<section ref={ref} id={id} className={"corner-popover " + className} data-position={position}
    hidden={!open} inert={!open} aria-hidden={!open} role="dialog" aria-modal="false" aria-label={title}>
    <header className="corner-popover-header"><h2>{title}</h2><button className="corner-popover-close" type="button" aria-label={closeLabel} onClick={() => { onClose(); restoreFocus(); }}><X size={16} aria-hidden="true" /></button></header>
    <div className="corner-popover-content">{children}</div>
  </section>, document.body);
}
