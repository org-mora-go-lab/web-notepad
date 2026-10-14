"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { GroupEntry } from "@/src/4-entity/notepad";
import {
  ALL_GROUP_ID,
  ALL_GROUP_NAME,
  compareGroups,
  UNGROUPED_GROUP_ID,
} from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";
import { ConfirmPopup } from "@/src/5-shared/ui";

import { GroupCreateForm, GroupItem } from "./component";
import type { GroupMenuProps, GroupProps } from "./type";

type GroupRow = Pick<GroupEntry, "id" | "name" | "pinned">;

const ANCHOR_SELECTOR = ".group-select-command";
const MOBILE_QUERY = "(max-width: 640px)";

// Group switcher dropdown that opens above the bottom bar's group button, styled like the tab context menu.
// Pick a group, or pin / rename / delete / create one right in the list.
// Portaled to the body (inside a `.group` wrapper for styles) like the other floating menus.
function GroupMenu({
  groups,
  activeGroupId,
  onClose,
  onCreate,
  onSelect,
  onRemove,
  onRename,
  onTogglePinGroup,
}: GroupMenuProps) {
  const { t } = useI18n();
  const menuRef = useRef<HTMLDivElement>(null);
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);
  // The row whose pin / edit / delete buttons are shown (opened with its … button).
  const [actionsGroupId, setActionsGroupId] = useState<string | null>(null);
  // The delete button that opened the popup, focused again when the popup is cancelled.
  const deleteAnchorRef = useRef<HTMLElement | null>(null);
  const groupToDelete = groups.find((group) => group.id === deletingGroupId);
  // All Group and Ungrouped share the first row (two halves); the create row follows, then the other groups (pinned first).
  const specialRows: GroupRow[] = [
    { id: ALL_GROUP_ID, name: ALL_GROUP_NAME, pinned: false },
    ...groups.filter((group) => group.id === UNGROUPED_GROUP_ID),
  ];
  const otherRows: GroupRow[] = [...groups]
    .sort(compareGroups)
    .filter((group) => group.id !== UNGROUPED_GROUP_ID);

  const renderRow = (group: GroupRow) => {
    const special =
      group.id === UNGROUPED_GROUP_ID || group.id === ALL_GROUP_ID;
    return (
      <GroupItem
        key={group.id}
        name={group.name}
        active={group.id === activeGroupId}
        pinned={group.pinned}
        editable={!special}
        muted={special}
        actionsOpen={actionsGroupId === group.id}
        onToggleActions={() =>
          setActionsGroupId((current) =>
            current === group.id ? null : group.id,
          )
        }
        onSelect={() => {
          onSelect(group.id);
          // Mobile closes the dropdown right after a group is picked.
          if (window.matchMedia(MOBILE_QUERY).matches) onClose();
        }}
        onRename={(name) => onRename(group.id, name)}
        onTogglePin={() => onTogglePinGroup(group.id)}
        onDelete={(anchor) => {
          deleteAnchorRef.current = anchor;
          setDeletingGroupId(group.id);
        }}
      />
    );
  };

  useLayoutEffect(() => {
    const menu = menuRef.current;
    const anchor = document.querySelector<HTMLElement>(ANCHOR_SELECTOR);
    if (!menu || !anchor) return;
    const position = () => {
      const rect = anchor.getBoundingClientRect();
      menu.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - menu.offsetWidth - 8))}px`;
      menu.style.bottom = `${window.innerHeight - rect.top + 4}px`;
    };
    position();
    window.addEventListener("resize", position);
    return () => window.removeEventListener("resize", position);
  }, []);

  useEffect(() => {
    if (groupToDelete) return;
    const anchor = document.querySelector<HTMLElement>(ANCHOR_SELECTOR);
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !anchor?.contains(target))
        onClose();
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
  }, [groupToDelete, onClose]);

  return createPortal(
    <div className="group">
      <div
        ref={menuRef}
        className="group-menu"
        id="groups-menu"
        role="dialog"
        aria-label={t.selectGroup}
      >
        <div className="group-list">
          <div className="group-split-row">{specialRows.map(renderRow)}</div>
          <GroupCreateForm onCreate={onCreate} />
          {otherRows.map(renderRow)}
        </div>
      </div>
      {groupToDelete && (
        <ConfirmPopup
          title={t.deleteGroupTitle}
          message={t.deleteGroupMessage(groupToDelete.name)}
          closeLabel={t.closeDeleteGroupConfirmation}
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

// The menu content mounts only while open, so row / popup state resets every time it closes.
export function Group({ open, ...props }: GroupProps) {
  return open ? <GroupMenu open={open} {...props} /> : null;
}
