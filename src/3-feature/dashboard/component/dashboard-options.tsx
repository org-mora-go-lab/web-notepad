import { Check, EllipsisVertical, Ghost, Snowflake } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useI18n } from "@/src/5-shared/hook";

import type { DashboardOptionsProps } from "../type";

export function DashboardOptions({
  iceboxVisible,
  closedVisible,
  onToggleIcebox,
  onToggleClosed,
}: DashboardOptionsProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.isComposing) return;
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
    };
    window.addEventListener("pointerdown", onPointerDown);
    // Handle the floating menu before the dashboard's Escape shortcut.
    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [open]);

  return (
    <div className="dashboard-options" ref={rootRef}>
      <button
        className="side-panel-action dashboard-options-trigger"
        ref={triggerRef}
        type="button"
        aria-label={t.dashboardOptions}
        title={t.dashboardOptions}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="dashboard-options-menu"
        onClick={() => setOpen((current) => !current)}
      >
        <EllipsisVertical />
      </button>
      {open && (
        <div
          className="dashboard-options-menu"
          id="dashboard-options-menu"
          role="dialog"
          aria-label={t.dashboardOptions}
        >
          <button
            className="dashboard-icebox-command"
            type="button"
            aria-pressed={iceboxVisible}
            onClick={onToggleIcebox}
          >
            <Snowflake size={18} strokeWidth={1.8} />
            <span>{t.icebox}</span>
            {iceboxVisible && <Check className="dashboard-option-check" size={16} />}
          </button>
          <button
            className="dashboard-closed-command"
            type="button"
            aria-pressed={closedVisible}
            onClick={onToggleClosed}
          >
            <Ghost size={18} strokeWidth={1.8} />
            <span>{t.closed}</span>
            {closedVisible && <Check className="dashboard-option-check" size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}
