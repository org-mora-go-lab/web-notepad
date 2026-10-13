"use client";

import { Check, Pencil, Pin, Trash2, X } from "lucide-react";
import { type FormEvent, useState } from "react";

import { useI18n } from "@/src/5-shared/hook";

type Props = {
  name: string;
  active: boolean;
  pinned: boolean;
  // The default and virtual groups only support selecting.
  editable: boolean;
  muted: boolean;
  onSelect: () => void;
  onRename: (name: string) => void;
  onTogglePin: () => void;
  onDelete: (anchor: HTMLElement) => void;
};

// One group row: click the name to switch; pin / edit / delete are inline icon buttons.
export function GroupItem({ name, active, pinned, editable, muted, onSelect, onRename, onTogglePin, onDelete }: Props) {
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
            aria-label={`${name} 그룹 이름 수정`}
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
          <button type="submit" aria-label="그룹 수정 저장" title={t.save} disabled={!editingName.trim()}>
            <Check size={14} />
          </button>
          <button type="button" aria-label="그룹 수정 취소" title={t.cancel} onClick={() => setEditingName(null)}>
            <X size={14} />
          </button>
        </form>
      </article>
    );
  }

  return (
    <article className={`group-item ${active ? "is-active" : ""}`}>
      <button className="group-select" type="button" aria-pressed={active} title={name} onClick={onSelect}>
        <strong className={muted ? "is-ungrouped" : ""}>{name}</strong>
      </button>
      {editable && (
        <div className="group-actions">
          <button
            className={`group-pin ${pinned ? "is-pinned" : ""}`}
            type="button"
            aria-label={`${name} 그룹 ${pinned ? "고정 해제" : "고정"}`}
            aria-pressed={pinned}
            title={pinned ? t.unpin : t.pin}
            onClick={onTogglePin}
          >
            <Pin size={14} />
          </button>
          <button type="button" aria-label={`${name} 그룹 수정`} title={t.edit} onClick={() => setEditingName(name)}>
            <Pencil size={14} />
          </button>
          <button
            type="button"
            aria-label={`${name} 그룹 삭제`}
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
