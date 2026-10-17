"use client";

import { BookOpen, ChevronDown, ChevronRight, Layers, Settings, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ALL_GROUP_ID, compareGroups, UNGROUPED_GROUP_ID } from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";
import { ConfirmPopup } from "@/src/5-shared/ui";

import { UserGuide } from "../user-guide";
import { GroupCreateForm, GroupItem } from "./component";
import { useGroupMenuResize, useGroupReorder } from "./hook";
import type { GroupMenuProps, GroupProps } from "./type";

const ANCHOR_SELECTOR = ".group-select-command";
const MOBILE_QUERY = "(max-width: 512px)";

function GroupSidebar({
  groups,
  activeGroupId,
  onClose,
  onCreate,
  onSelect,
  onRemove,
  onRename,
  onTogglePinGroup,
  onMoveGroup,
  onOpenSettings,
  onOpenShortcuts,
}: GroupMenuProps) {
  const { t } = useI18n();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const handleResizeStart = useGroupMenuResize(sidebarRef);
  const reorder = useGroupReorder(onMoveGroup);
  const [groupsExpanded, setGroupsExpanded] = useState(true);
  const [guideOpen, setGuideOpen] = useState(false);
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);
  const [actionsGroupId, setActionsGroupId] = useState<string | null>(null);
  const deleteAnchorRef = useRef<HTMLElement | null>(null);
  const groupToDelete = groups.find((group) => group.id === deletingGroupId);
  const ungrouped = groups.find((group) => group.id === UNGROUPED_GROUP_ID);
  const otherRows = [...groups]
    .sort(compareGroups)
    .filter((group) => group.id !== UNGROUPED_GROUP_ID);

  const selectGroup = (groupId: string) => {
    onSelect(groupId);
    if (window.matchMedia(MOBILE_QUERY).matches) onClose();
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      event.preventDefault();
      onClose();
      document.querySelector<HTMLElement>(ANCHOR_SELECTOR)?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return createPortal(
    <div className="group">
      <div className="group-sidebar-backdrop" onClick={onClose} aria-hidden="true" />
      <aside
        ref={sidebarRef}
        className="group-menu"
        id="groups-menu"
        aria-label={t.sidebarTitle}
      >
        <header className="group-sidebar-header">
          <h2>{t.sidebarTitle}</h2>
          <button type="button" onClick={onClose} aria-label={t.closePanel(t.sidebarTitle)}>
            <X aria-hidden="true" />
          </button>
        </header>
        <section className="group-section">
          <button
            className="group-section-toggle"
            type="button"
            aria-expanded={groupsExpanded}
            aria-controls="group-sidebar-list"
            onClick={() => setGroupsExpanded((current) => !current)}
          >
            {groupsExpanded ? <ChevronDown aria-hidden="true" /> : <ChevronRight aria-hidden="true" />}
            <span>{t.group}</span>
          </button>
          {groupsExpanded && (
            <div className="group-list" id="group-sidebar-list">
              <div className="group-system-list">
                <button
                  className={activeGroupId === ALL_GROUP_ID ? "is-active" : ""}
                  type="button"
                  aria-pressed={activeGroupId === ALL_GROUP_ID}
                  onClick={() => selectGroup(ALL_GROUP_ID)}
                >
                  <Layers aria-hidden="true" />
                  <strong>{t.allGroup}</strong>
                </button>
                {ungrouped && (
                  <button
                    className={activeGroupId === UNGROUPED_GROUP_ID ? "is-active" : ""}
                    type="button"
                    aria-pressed={activeGroupId === UNGROUPED_GROUP_ID}
                    onClick={() => selectGroup(UNGROUPED_GROUP_ID)}
                  >
                    <Layers aria-hidden="true" />
                    <strong>{ungrouped.name}</strong>
                  </button>
                )}
              </div>
              <GroupCreateForm onCreate={onCreate} />
              {otherRows.map((group) => (
                <GroupItem
                  key={group.id}
                  groupId={group.id}
                  dragging={reorder.draggingId === group.id}
                  dropTarget={reorder.targetId === group.id}
                  onReorderStart={(event) => reorder.start(group.id, event)}
                  onReorderKey={(direction) => {
                    const peers = otherRows.filter((item) => item.pinned === group.pinned);
                    const target = peers[peers.findIndex((item) => item.id === group.id) + direction];
                    if (target) onMoveGroup(group.id, target.id);
                  }}
                  name={group.name}
                  active={group.id === activeGroupId}
                  pinned={group.pinned}
                  editable
                  muted={false}
                  actionsOpen={actionsGroupId === group.id}
                  onToggleActions={() => setActionsGroupId((current) => current === group.id ? null : group.id)}
                  onSelect={() => selectGroup(group.id)}
                  onRename={(name) => onRename(group.id, name)}
                  onTogglePin={() => onTogglePinGroup(group.id)}
                  onDelete={(anchor) => {
                    deleteAnchorRef.current = anchor;
                    setDeletingGroupId(group.id);
                  }}
                />
              ))}
            </div>
          )}
        </section>
        <div className="group-tools-list" id="group-sidebar-tools">
          <button type="button" onClick={() => { onClose(); onOpenSettings(); }}>
            <Settings aria-hidden="true" />
            <span>{t.settings}</span>
          </button>
          <button type="button" onClick={() => setGuideOpen(true)}>
            <BookOpen aria-hidden="true" />
            <span>{t.guide}</span>
          </button>
        </div>
        <div
          className="group-menu-resizer"
          role="separator"
          aria-orientation="vertical"
          aria-label={t.resizeGroupMenu}
          onPointerDown={handleResizeStart}
        />
      </aside>
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
      {guideOpen && (
        <UserGuide
          onClose={() => setGuideOpen(false)}
          onOpenShortcuts={() => {
            setGuideOpen(false);
            onClose();
            onOpenShortcuts();
          }}
        />
      )}
    </div>,
    document.body,
  );
}

export function Group({ open, ...props }: GroupProps) {
  return open ? <GroupSidebar open={open} {...props} /> : null;
}
