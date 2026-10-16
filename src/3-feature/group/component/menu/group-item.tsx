"use client";

import { Check, EllipsisVertical, Pencil, Pin, Trash2, X } from "lucide-react";
import { type FormEvent, useState } from "react";

import { useI18n } from "@/src/5-shared/hook";

import type { GroupItemProps } from "../../type";

// One group row: click the name to switch; pin / edit / delete are inline icon buttons.
export function GroupItem({
  name,
  active,
  pinned,
  editable,
  muted,
  actionsOpen,
  onToggleActions,
  onSelect,
  onRename,
  onTogglePin,
  onDelete,
}: GroupItemProps) {
  const { t } = useI18n();
  const [editingName, setEditingName] = useState<string | null>(null);

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
    <article className={`group-item ${active ? "is-active" : ""}`}>
      <button
        className="group-select"
        type="button"
        aria-pressed={active}
        title={name}
        onClick={onSelect}
      >
        <strong className={muted ? "is-ungrouped" : ""}>{name}</strong>
      </button>
      {editable && !actionsOpen && (
        <div className="group-actions">
          {pinned && (
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
            aria-expanded={false}
            title={t.groupActions}
            onClick={onToggleActions}
          >
            <EllipsisVertical size={14} />
          </button>
        </div>
      )}
      {editable && actionsOpen && (
        <div className="group-actions">
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
            <Pin size={14} />
          </button>
          <button
            type="button"
            aria-label={t.editGroupFor(name)}
            title={t.edit}
            onClick={() => {
              onToggleActions();
              setEditingName(name);
            }}
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            aria-label={t.deleteGroupFor(name)}
            title={t.delete}
            onClick={(event) => onDelete(event.currentTarget)}
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </article>
  );
}
