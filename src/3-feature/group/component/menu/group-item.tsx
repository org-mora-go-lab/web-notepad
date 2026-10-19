"use client";

import { Bookmark, Check, EllipsisVertical, Pencil, Pin, Trash2, X } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";

import { useI18n } from "@/src/5-shared/hook";

import type { GroupItemProps } from "../../type";

// One group row: click the name to switch; use the right-side menu for actions.
export function GroupItem({
  groupId,
  dragging,
  dropTarget,
  onReorderStart,
  onReorderKey,
  name,
  active,
  pinned,
  editable,
  muted,
  system = false,
  actionsOpen,
  onToggleActions,
  onSelect,
  onRename,
  onTogglePin,
  onOpenBookmarks,
  onDelete,
}: GroupItemProps) {
  const { t } = useI18n();
  const [editingName, setEditingName] = useState<string | null>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0 });
  const positionActions = (anchor: HTMLElement) => {
    const rect = anchor.getBoundingClientRect();
    setMenuPosition({
      left: Math.max(8, Math.min(rect.right - 164, window.innerWidth - 172)),
      top: rect.bottom + 8 + 168 > window.innerHeight ? rect.top - 176 : rect.bottom + 8,
    });
  };

  useEffect(() => {
    if (!actionsOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!actionsRef.current?.contains(event.target as Node)) onToggleActions();
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onToggleActions();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape, true);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape, true);
    };
  }, [actionsOpen, onToggleActions]);

  const handleRename = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = (editingName ?? "").trim();
    if (!trimmedName) return;
    onRename(trimmedName);
    setEditingName(null);
  };

  if (editingName !== null) {
    return (
      <article className={`group-item ${active ? "is-active" : ""}`}>
        <form className="group-edit-form" onSubmit={handleRename}>
          <input
            type="text"
            value={editingName}
            onChange={(event) => setEditingName(event.target.value)}
            aria-label={t.editGroupName(name)}
            maxLength={60}
            autoFocus
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                setEditingName(null);
              }
            }}
          />
          <button
            type="submit"
            aria-label={t.saveGroupEdit}
            title={t.save}
            disabled={!editingName.trim()}
          >
            <Check size={14} />
          </button>
          <button
            type="button"
            aria-label={t.cancelGroupEdit}
            title={t.cancel}
            onClick={() => setEditingName(null)}
          >
            <X size={14} />
          </button>
        </form>
      </article>
    );
  }

  return (
    <article
      data-group-id={groupId}
      data-pinned={pinned}
      className={`${system ? "group-system-item" : "group-item"} ${active ? "is-active" : ""} ${dragging ? "is-dragging" : ""} ${dropTarget ? "is-drop-target" : ""}`}
      onPointerDown={(event) => {
        if (!editable || event.button !== 0) return;
        const target = event.target as Element;
        if (target.closest(".group-actions, .group-reorder")) return;
        onReorderStart(event);
      }}
    >
      <button
        className="group-reorder"
        type="button"
        aria-label={t.reorderGroup(name)}
        title={t.reorderGroup(name)}
        onKeyDown={(event) => {
          if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
          event.preventDefault();
          onReorderKey(event.key === "ArrowUp" ? -1 : 1);
        }}
      >
      </button>
      <button
        className="group-select"
        type="button"
        aria-pressed={active}
        title={name}
        onClick={(event) => {
          const row = event.currentTarget.closest<HTMLElement>("[data-group-id]");
          if (row?.dataset.reorderDragged === "true") {
            delete row.dataset.reorderDragged;
            return;
          }
          onSelect();
        }}
        onContextMenu={(event) => {
          if (window.matchMedia("(max-width: 512px)").matches) return;
          event.preventDefault();
          positionActions(event.currentTarget);
          if (!actionsOpen) onToggleActions();
        }}
      >
        <strong className={muted ? "is-ungrouped" : ""}>{name}</strong>
      </button>
      <div className="group-actions" ref={actionsRef}>
          {editable && pinned && (
            <Pin
              className="group-pin-indicator"
              size={14}
              role="img"
              aria-label={t.pinnedGroup}
            />
          )}
          <button
            type="button"
            aria-label={t.groupActionsFor(name)}
            aria-expanded={actionsOpen}
            aria-controls={`group-actions-${groupId}`}
            title={t.groupActions}
            onClick={(event) => {
              positionActions(event.currentTarget);
              onToggleActions();
            }}
          >
            <EllipsisVertical size={14} />
          </button>
          {actionsOpen && (
            <div
              className="group-action-dropdown"
              id={`group-actions-${groupId}`}
              style={{ left: menuPosition.left, top: menuPosition.top }}
            >
              {editable && (
                <button
                  className={`group-pin ${pinned ? "is-pinned" : ""}`}
                  type="button"
                  aria-label={pinned ? t.unpinGroup(name) : t.pinGroup(name)}
                  aria-pressed={pinned}
                  title={pinned ? t.unpin : t.pin}
                  onClick={() => {
                    onTogglePin();
                    onToggleActions();
                  }}
                >
                  <Pin size={16} />
                  <span>{pinned ? t.unpin : t.pin}</span>
                </button>
              )}
              <button
              type="button"
                aria-label={`${name} · ${t.bookmark}`}
                onClick={onOpenBookmarks}
              >
                <Bookmark size={16} />
                <span>{t.bookmark}</span>
              </button>
              {editable && (
                <>
                  <button
                    type="button"
                    aria-label={t.editGroupFor(name)}
                    title={t.edit}
                    onClick={() => {
                      onToggleActions();
                      setEditingName(name);
                    }}
                  >
                    <Pencil size={16} />
                    <span>{t.edit}</span>
                  </button>
                  <button
                    type="button"
                    aria-label={t.deleteGroupFor(name)}
                    title={t.delete}
                    onClick={(event) =>
                      onDelete(
                        actionsRef.current?.querySelector("button") ?? event.currentTarget,
                      )
                    }
                  >
                    <Trash2 size={16} />
                    <span>{t.delete}</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
    </article>
  );
}
