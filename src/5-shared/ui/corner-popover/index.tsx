"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { useModalDialog } from "../../hook";
import type { CornerPopoverProps } from "./type";

export function CornerPopover({
  id,
  className,
  title,
  closeLabel,
  headerActions,
  open,
  triggerSelector,
  onClose,
  children,
}: CornerPopoverProps) {
  const ref = useModalDialog(open, ".corner-popover-close");
  const triggerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.querySelector<HTMLElement>(triggerSelector);
  }, [open, triggerSelector]);
  const close = () => {
    ref.current?.close();
    onClose();
    if (triggerRef.current?.isConnected) triggerRef.current.focus();
  };
  if (typeof document === "undefined") return null;
  return createPortal(
    <dialog
      ref={ref}
      id={id}
      className={"corner-popover " + className}
      hidden={!open}
      inert={!open}
      aria-hidden={!open}
      role="dialog"
      aria-modal={open ? "true" : "false"}
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <header className="corner-popover-header">
        <h2>{title}</h2>
        {headerActions}
        <button
          className="corner-popover-close"
          type="button"
          aria-label={closeLabel}
          onClick={close}
        >
          <X size={16} aria-hidden="true" />
        </button>
      </header>
      <div className="corner-popover-content">{children}</div>
    </dialog>,
    document.body,
  );
}
