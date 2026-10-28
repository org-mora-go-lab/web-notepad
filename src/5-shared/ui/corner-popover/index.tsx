"use client";

import { X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { useWorkspacePopoverPosition } from "../../hook";
import type { CornerPopoverProps } from "./type";

export function CornerPopover({
  id,
  className,
  title,
  closeLabel,
  headerActions,
  open,
  position,
  triggerSelector,
  outsideIgnoreSelector,
  onClose,
  children,
}: CornerPopoverProps) {
  const ref = useRef<HTMLElement>(null);
  const closeRef = useRef(onClose);
  const triggerRef = useRef<HTMLElement | null>(null);
  useWorkspacePopoverPosition(ref, open && position === "bottom");
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);
  const restoreFocus = () => {
    if (triggerRef.current?.isConnected) triggerRef.current.focus();
  };
  useLayoutEffect(() => {
    if (!open || position !== "top") return;
    const trigger = document.querySelector<HTMLElement>(triggerSelector),
      popup = ref.current;
    if (!trigger || !popup) return;
    const place = () => {
      const anchor = trigger.getBoundingClientRect();
      const viewport = window.visualViewport;
      const leftEdge = (viewport?.offsetLeft ?? 0) + 8;
      const rightEdge = leftEdge + (viewport?.width ?? window.innerWidth) - 16;
      const top = anchor.bottom + 7;
      popup.style.top = top + "px";
      popup.style.left =
        Math.max(
          leftEdge,
          Math.min(
            anchor.right - popup.offsetWidth,
            rightEdge - popup.offsetWidth,
          ),
        ) + "px";
      popup.style.right = "auto";
      popup.style.maxHeight =
        Math.max(
          44,
          Math.min(
            420,
            (viewport?.height ?? window.innerHeight) +
              (viewport?.offsetTop ?? 0) -
              top -
              8,
          ),
        ) + "px";
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(trigger);
    observer.observe(popup);
    if (trigger.parentElement) observer.observe(trigger.parentElement);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    window.visualViewport?.addEventListener("resize", place);
    window.visualViewport?.addEventListener("scroll", place);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      window.visualViewport?.removeEventListener("resize", place);
      window.visualViewport?.removeEventListener("scroll", place);
    };
  }, [open, position, triggerSelector]);
  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.querySelector<HTMLElement>(triggerSelector);
    ref.current
      ?.querySelector<HTMLButtonElement>(".corner-popover-close")
      ?.focus();
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !ref.current?.contains(target) &&
        !triggerRef.current?.contains(target) &&
        !(
          outsideIgnoreSelector &&
          event.target instanceof Element &&
          event.target.closest(outsideIgnoreSelector)
        )
      )
        closeRef.current();
    };
    const escape = (event: KeyboardEvent) => {
      if (
        event.key !== "Escape" ||
        event.isComposing ||
        document.querySelector("dialog[open]")
      )
        return;
      event.preventDefault();
      event.stopImmediatePropagation();
      closeRef.current();
      restoreFocus();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape, true);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape, true);
    };
  }, [open, triggerSelector, outsideIgnoreSelector]);
  if (typeof document === "undefined") return null;
  return createPortal(
    <section
      ref={ref}
      id={id}
      className={"corner-popover " + className}
      data-position={position}
      hidden={!open}
      inert={!open}
      aria-hidden={!open}
      role="dialog"
      aria-modal="false"
      aria-label={title}
    >
      <header className="corner-popover-header">
        <h2>{title}</h2>
        {headerActions}
        <button
          className="corner-popover-close"
          type="button"
          aria-label={closeLabel}
          onClick={() => {
            onClose();
            restoreFocus();
          }}
        >
          <X size={16} aria-hidden="true" />
        </button>
      </header>
      <div className="corner-popover-content">{children}</div>
    </section>,
    document.body,
  );
}
