"use client";

import { Pencil, Pin, Trash2 } from "lucide-react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { useI18n } from "@/src/5-shared/hook";

type Props = {
  groupName: string;
  // The ⋮ button the menu opens from; pressing it again toggles the menu instead of reopening.
  anchor: HTMLElement;
  pinned: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  onClose: () => void;
};

// Group actions dropdown under the ⋮ button, styled like the tab context menu.
// Portaled to the body (inside a `.group` wrapper for styles) so the sliding drawer transform does not offset it.
export function GroupActionMenu({ groupName, anchor, pinned, onEdit, onDelete, onTogglePin, onClose }: Props) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const rect = anchor.getBoundingClientRect();
    const left = rect.right - menu.offsetWidth;
    const below = rect.bottom + 4;
    const top = below + menu.offsetHeight > window.innerHeight - 8 ? rect.top - menu.offsetHeight - 4 : below;
    menu.style.left = `${Math.max(8, Math.min(left, window.innerWidth - menu.offsetWidth - 8))}px`;
    menu.style.top = `${Math.max(8, top)}px`;
    menu.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
  }, [anchor]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !anchor.contains(target)) onClose();
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [anchor, onClose]);

  return createPortal(
    <div className="group">
      <div
        ref={menuRef}
        className="group-action-menu"
        role="menu"
        aria-label={`${groupName} 그룹 메뉴`}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            onClose();
          } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'));
            const index = items.indexOf(document.activeElement as HTMLButtonElement);
            items[(index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
          }
        }}
      >
        <button type="button" role="menuitem" aria-label={`${groupName} 그룹 수정`} onClick={onEdit}>
          <Pencil size={14} />
          <span>{t.edit}</span>
        </button>
        <button type="button" role="menuitem" aria-label={`${groupName} 그룹 삭제`} onClick={onDelete}>
          <Trash2 size={14} />
          <span>{t.delete}</span>
        </button>
        <button type="button" role="menuitem" aria-label={`${groupName} 그룹 ${pinned ? "고정 해제" : "고정"}`} onClick={onTogglePin}>
          <Pin size={14} />
          <span>{pinned ? t.unpin : t.pin}</span>
        </button>
      </div>
    </div>,
    document.body,
  );
}
