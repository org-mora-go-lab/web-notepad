"use client";

import { Pin, X } from "lucide-react";
import type { ReactNode } from "react";

import { useI18n } from "../../hook";
import { useSidePanelResize } from "./hook";

type Props = {
  // Module class added next to `side-panel` so each feature can style its own panel.
  className: string;
  id: string;
  title: string;
  open: boolean;
  closeLabel: string;
  ariaLabel?: string;
  // PC only: docks the drawer to the right edge beside the workspace.
  pinned?: boolean;
  onTogglePin?: () => void;
  onClose: () => void;
  children: ReactNode;
};

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
  onClose,
  children,
}: Props) {
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
      >
        <div
          className="side-panel-resizer"
          role="separator"
          aria-orientation="vertical"
          aria-label="패널 크기 조절"
          onPointerDown={handleResizeStart}
        />
        <div className="side-panel-header">
          <h2>{title}</h2>
          <div className="side-panel-header-actions">
            {onTogglePin && (
              <button
                className="side-panel-pin"
                type="button"
                onClick={onTogglePin}
                aria-pressed={pinned}
                aria-label={pinned ? "패널 고정 해제" : "패널 고정"}
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
