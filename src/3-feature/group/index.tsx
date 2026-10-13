"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { GroupEntry } from "@/src/4-entity/notepad";
import { ALL_GROUP_ID, ALL_GROUP_NAME, compareGroups, UNGROUPED_GROUP_ID } from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";
import { ConfirmPopup } from "@/src/5-shared/ui";

import { GroupCreateForm, GroupItem } from "./component";

type Props = {
  groups: GroupEntry[];
  activeGroupId: string;
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
  onSelect: (groupId: string) => void;
  onRemove: (groupId: string) => void;
  onRename: (groupId: string, name: string) => void;
  onTogglePinGroup: (groupId: string) => void;
};

const ANCHOR_SELECTOR = ".group-select-command";

// Group switcher dropdown that opens above the bottom bar's group button, styled like the tab context menu.
// Pick a group, or pin / rename / delete / create one right in the list.
// Portaled to the body (inside a `.group` wrapper for styles) like the other floating menus.
export function Group({
  groups,
  activeGroupId,
  open,
  onClose,
  onCreate,
  onSelect,
  onRemove,
  onRename,
  onTogglePinGroup,
}: Props) {
  const { t } = useI18n();
  const menuRef = useRef<HTMLDivElement>(null);
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);
  // The delete button that opened the popup, focused again when the popup is cancelled.
  const deleteAnchorRef = useRef<HTMLElement | null>(null);
  const groupToDelete = groups.find((group) => group.id === deletingGroupId);
  // The virtual All Group always comes last, below Ungrouped.
  const rows: Array<Pick<GroupEntry, "id" | "name" | "pinned">> = [
    ...[...groups].sort(compareGroups),
    { id: ALL_GROUP_ID, name: ALL_GROUP_NAME, pinned: false },
  ];

  useLayoutEffect(() => {
    const menu = menuRef.current;
    const anchor = document.querySelector<HTMLElement>(ANCHOR_SELECTOR);
    if (!open || !menu || !anchor) return;
    const position = () => {
      const rect = anchor.getBoundingClientRect();
      menu.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - menu.offsetWidth - 8))}px`;
      menu.style.bottom = `${window.innerHeight - rect.top + 4}px`;
    };
    position();
    window.addEventListener("resize", position);
    return () => window.removeEventListener("resize", position);
  }, [open]);

  useEffect(() => {
    if (!open || groupToDelete) return;
    const anchor = document.querySelector<HTMLElement>(ANCHOR_SELECTOR);
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !anchor?.contains(target)) onClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      anchor?.focus();
      onClose();
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, groupToDelete, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="group">
      <div ref={menuRef} className="group-menu" id="groups-menu" role="dialog" aria-label="그룹 선택">
        <div className="group-list">
          {rows.map((group) => {
            const special = group.id === UNGROUPED_GROUP_ID || group.id === ALL_GROUP_ID;
            return (
              <GroupItem
                key={group.id}
                name={group.name}
                active={group.id === activeGroupId}
                pinned={group.pinned}
                editable={!special}
                muted={special}
                onSelect={() => {
                  onSelect(group.id);
                  onClose();
                }}
                onRename={(name) => onRename(group.id, name)}
                onTogglePin={() => onTogglePinGroup(group.id)}
                onDelete={(anchor) => {
                  deleteAnchorRef.current = anchor;
                  setDeletingGroupId(group.id);
                }}
              />
            );
          })}
        </div>
        <GroupCreateForm onCreate={onCreate} />
      </div>
      {groupToDelete && (
        <ConfirmPopup
          title={t.deleteGroupTitle}
          message={t.deleteGroupMessage(groupToDelete.name)}
          closeLabel="삭제 확인 닫기"
          closeTitle={t.close}
          onCancel={() => {
            setDeletingGroupId(null);
            deleteAnchorRef.current?.focus();
          }}
          onConfirm={() => {
            onRemove(groupToDelete.id);
            setDeletingGroupId(null);
          }}
        />
      )}
    </div>,
    document.body,
  );
}
