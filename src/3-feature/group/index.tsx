"use client";

import { X } from "lucide-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ALL_GROUP_ID, compareGroups, type GroupEntry, isSharedGroupId, UNGROUPED_GROUP_ID, useNotepadStore } from "@/src/4-entity/notepad";
import { GroupSharingContext, useI18n } from "@/src/5-shared/hook";
import { ConfirmPopup } from "@/src/5-shared/ui";

import { GroupCreateForm, GroupItem, GroupShareDialog } from "./component";
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
}: GroupMenuProps) {
  const { t } = useI18n();
  const sharing = useContext(GroupSharingContext);
  const [accessAction, setAccessAction] = useState<{ groupId: string; action: "leave" | "revoke"; anchor: HTMLElement } | null>(null);
  const [accessError, setAccessError] = useState(false);
  const accessBusy = useRef(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const handleResizeStart = useGroupMenuResize(sidebarRef);
  const reorder = useGroupReorder(onMoveGroup);
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);
  const [actionsGroupId, setActionsGroupId] = useState<string | null>(null);
  const [sharingGroup, setSharingGroup] = useState<GroupEntry | null>(null);
  const deleteAnchorRef = useRef<HTMLElement | null>(null);
  const groupToDelete = groups.find((group) => group.id === deletingGroupId);
  const ungrouped = groups.find((group) => group.id === UNGROUPED_GROUP_ID);
  const otherRows = [...groups]
    .sort(compareGroups)
    .filter((group) => group.id !== UNGROUPED_GROUP_ID);

  const handleShared = useCallback((originalId: string, sharedGroup: GroupEntry) => {
    if (originalId !== sharedGroup.id) {
      useNotepadStore.getState().adoptSharedGroup(originalId, sharedGroup);
    }
    window.dispatchEvent(new Event("shared-groups-changed"));
  }, []);

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
          <div className="group-list" id="group-sidebar-list">
              <GroupCreateForm onCreate={onCreate} />
              {otherRows.map((group) => (
                <GroupItem
                  key={group.id}
                  groupId={group.id}
                  shared={isSharedGroupId(group.id)}
                  sharingRole={sharing?.accessByGroup[group.id]?.role}
                  sharingActive={sharing?.accessByGroup[group.id]?.active}
                  onChangeSharing={(action, anchor) => { setAccessError(false); setAccessAction({ groupId: group.id, action, anchor }); }}
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
                  onShare={() => setSharingGroup(group)}
                />
              ))}
          </div>
        </section>
        <div className="group-system-list">
          <GroupItem
            groupId={ALL_GROUP_ID}
            dragging={false}
            dropTarget={false}
            onReorderStart={() => undefined}
            onReorderKey={() => undefined}
            name={t.allGroup}
            active={activeGroupId === ALL_GROUP_ID}
            pinned={false}
            editable={false}
            muted={false}
            system
            actionsOpen={actionsGroupId === ALL_GROUP_ID}
            onToggleActions={() =>
              setActionsGroupId((current) => current === ALL_GROUP_ID ? null : ALL_GROUP_ID)
            }
            onSelect={() => selectGroup(ALL_GROUP_ID)}
            onRename={() => undefined}
            onTogglePin={() => undefined}
            onDelete={() => undefined}
            onShare={() => undefined}
          />
          {ungrouped && (
            <GroupItem
              groupId={ungrouped.id}
              dragging={false}
              dropTarget={false}
              onReorderStart={() => undefined}
              onReorderKey={() => undefined}
              name={ungrouped.name}
              active={activeGroupId === UNGROUPED_GROUP_ID}
              pinned={false}
              editable={false}
              muted
              system
              actionsOpen={actionsGroupId === ungrouped.id}
              onToggleActions={() => setActionsGroupId((current) => current === ungrouped.id ? null : ungrouped.id)}
              onSelect={() => selectGroup(UNGROUPED_GROUP_ID)}
              onRename={() => undefined}
              onTogglePin={() => undefined}
              onDelete={() => undefined}
              onShare={() => undefined}
            />
          )}
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
      {accessAction && <>
        <ConfirmPopup
          title={accessAction.action === "leave" ? t.leaveGroup : t.revokeGroupShare}
          message={accessAction.action === "leave" ? t.leaveGroupMessage : t.revokeGroupShareMessage}
          closeLabel={t.close} closeTitle={t.close}
          confirmLabel={accessAction.action === "leave" ? t.leaveGroup : t.revokeGroupShare}
          keepOpenOnConfirm
          error={accessError ? t.groupAccessError : undefined}
          onCancel={() => { setAccessAction(null); accessAction.anchor.focus(); }}
          onConfirm={async () => {
            if (accessBusy.current || !sharing) return;
            accessBusy.current = true;
            setAccessError(false);
            try {
              if (await sharing.changeAccess(accessAction.groupId, accessAction.action)) {
                setAccessAction(null);
                accessAction.anchor.focus();
              } else setAccessError(true);
            } finally { accessBusy.current = false; }
          }}
        />
      </>}
      {sharingGroup && <GroupShareDialog
        group={sharingGroup}
        onClose={() => setSharingGroup(null)}
        onShared={handleShared}
      />}
    </div>,
    document.body,
  );
}

export function Group({ open, ...props }: GroupProps) {
  return open ? <GroupSidebar open={open} {...props} /> : null;
}
