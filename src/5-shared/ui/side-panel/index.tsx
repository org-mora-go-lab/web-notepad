"use client";

import { Pin, X } from "lucide-react";

import { useI18n } from "../../hook";
import { useSidePanelResize } from "./hook";
import type { SidePanelProps } from "./type";

// Right drawer shell: backdrop, sliding aside and a header with pin and close buttons.
export function SidePanel({
  className,
  id,
  title,
  open,
  closeLabel,
  ariaLabel,
  pinned = false,
  onTogglePin,
  headerActions,
  onClose,
  children,
}: SidePanelProps) {
  const handleResizeStart = useSidePanelResize();
  const { t } = useI18n();

  return (
    <div className={`side-panel ${className} ${pinned ? "is-pinned" : ""}`}>
      <div
        className={`side-panel-backdrop ${open ? "is-visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        id={id}
        className={`side-panel-drawer ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        aria-label={ariaLabel}
        inert={!open}
      >
        <div
          className="side-panel-resizer"
          role="separator"
          aria-orientation="vertical"
          aria-label={t.resizePanel}
          onPointerDown={handleResizeStart}
        />
        <div className="side-panel-header">
          <h2>{title}</h2>
          <div className="side-panel-header-actions">
            {headerActions}
            {onTogglePin && (
              <button
                className="side-panel-pin"
                type="button"
                onClick={onTogglePin}
                aria-pressed={pinned}
                aria-label={pinned ? t.unpinPanel : t.pinPanel}
                title={pinned ? t.unpinPanel : t.pinPanel}
              >
                <Pin size={14} />
              </button>
            )}
            <button
              className="side-panel-close"
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
            >
              <X size={16} />
            </button>
          </div>
        </div>
        {children}
      </aside>
    </div>
  );
}
