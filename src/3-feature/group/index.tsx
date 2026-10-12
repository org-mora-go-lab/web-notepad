"use client";

import { Check, EllipsisVertical, Pin, Plus, X } from "lucide-react";
import { type FormEvent, useRef, useState } from "react";

import type { GroupEntry } from "@/src/4-entity/notepad";
import { compareGroups, UNGROUPED_GROUP_ID } from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";
import { ConfirmPopup, SearchField, SidePanel } from "@/src/5-shared/ui";
import { SearchHighlight } from "@/src/5-shared/ui/search-field/component";
import { matchesSearchQuery } from "@/src/5-shared/ui/search-field/util";

import { GroupActionMenu } from "./component";

type Props = {
  groups: GroupEntry[];
  activeGroupId: string;
  open: boolean;
  pinned: boolean;
  onTogglePin: () => void;
  onClose: () => void;
  onCreate: (name: string) => void;
  onSelect: (groupId: string) => void;
  onRemove: (groupId: string) => void;
  onRename: (groupId: string, name: string) => void;
  onTogglePinGroup: (groupId: string) => void;
};

export function Group({
  groups,
  activeGroupId,
  open,
  pinned,
  onTogglePin,
  onClose,
  onCreate,
  onSelect,
  onRemove,
  onRename,
  onTogglePinGroup,
}: Props) {
  const [groupName, setGroupName] = useState("");
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);
  const [menu, setMenu] = useState<{ groupId: string; anchor: HTMLElement } | null>(null);
  const menuGroup = groups.find((group) => group.id === menu?.groupId);
  // The ⋮ button that opened the delete popup, focused again when the popup is cancelled.
  const deleteAnchorRef = useRef<HTMLElement | null>(null);
  const groupToDelete = groups.find((group) => group.id === deletingGroupId);
  const filteredGroups = groups
    .filter((group) => matchesSearchQuery(searchQuery, group.name))
    .sort(compareGroups);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = groupName.trim();
    if (!trimmedName) return;
    onCreate(trimmedName);
    setGroupName("");
  };

  const handleRename = (event: FormEvent<HTMLFormElement>, groupId: string) => {
    event.preventDefault();
    const trimmedName = editingName.trim();
    if (!trimmedName) return;
    onRename(groupId, trimmedName);
    setEditingGroupId(null);
  };

  return (
    <SidePanel
      className="group"
      id="groups-panel"
      title={t.groupsTitle}
      open={open}
      pinned={pinned}
      onTogglePin={onTogglePin}
      closeLabel="그룹 닫기"
      onClose={onClose}
    >
      <SearchField
        value={searchQuery}
        ariaLabel="그룹 검색"
        placeholder={t.searchGroups}
        onChange={setSearchQuery}
      />
      <form className="group-create-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={groupName}
          onChange={(event) => setGroupName(event.target.value)}
          placeholder={t.groupName}
          aria-label="새 그룹 이름"
          maxLength={60}
        />
        <button
          type="submit"
          aria-label="그룹 생성"
          disabled={!groupName.trim()}
        >
          <Plus size={16} />
        </button>
      </form>
      <div className="group-list">
        {filteredGroups.length === 0 ? (
          <div className="search-empty-state">
            <p>{t.noSearchResults}</p>
          </div>
        ) : (
          filteredGroups.map((group) => (
            <article
              className={`group-item ${group.id === activeGroupId ? "is-active" : ""}`}
              key={group.id}
            >
              {editingGroupId === group.id ? (
                <form className="group-edit-form" onSubmit={(event) => handleRename(event, group.id)}>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(event) => setEditingName(event.target.value)}
                    aria-label={`${group.name} 그룹 이름 수정`}
                    maxLength={60}
                    autoFocus
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        event.preventDefault();
                        setEditingGroupId(null);
                      }
                    }}
                  />
                  <button type="submit" aria-label="그룹 수정 저장" title={t.save} disabled={!editingName.trim()}>
                    <Check size={14} />
                  </button>
                  <button type="button" aria-label="그룹 수정 취소" title={t.cancel} onClick={() => setEditingGroupId(null)}>
                    <X size={14} />
                  </button>
                </form>
              ) : (
                <>
                  <button
                    className="group-select"
                    type="button"
                    aria-pressed={group.id === activeGroupId}
                    onClick={() => onSelect(group.id)}
                  >
                    <strong
                      className={
                        group.id === UNGROUPED_GROUP_ID ? "is-ungrouped" : ""
                      }
                    >
                      <SearchHighlight text={group.name} query={searchQuery} />
                    </strong>
                  </button>
                  {group.pinned && (
                    <Pin className="group-pin-indicator" size={14} role="img" aria-label="고정된 그룹" />
                  )}
                  {group.id !== UNGROUPED_GROUP_ID && (
                    <button
                      className="group-menu-trigger"
                      type="button"
                      aria-label={`${group.name} 그룹 메뉴`}
                      title={t.groupActions}
                      aria-haspopup="menu"
                      aria-expanded={menu?.groupId === group.id}
                      onClick={(event) => {
                        const anchor = event.currentTarget;
                        setMenu(menu?.groupId === group.id ? null : { groupId: group.id, anchor });
                      }}
                    >
                      <EllipsisVertical size={14} />
                    </button>
                  )}
                </>
              )}
            </article>
          ))
        )}
      </div>
    {open && menu && menuGroup && (
      <GroupActionMenu
        groupName={menuGroup.name}
        anchor={menu.anchor}
        pinned={menuGroup.pinned}
        onClose={() => {
          menu.anchor.focus();
          setMenu(null);
        }}
        onEdit={() => {
          setMenu(null);
          setEditingGroupId(menuGroup.id);
          setEditingName(menuGroup.name);
        }}
        onDelete={() => {
          deleteAnchorRef.current = menu.anchor;
          setMenu(null);
          setDeletingGroupId(menuGroup.id);
        }}
        onTogglePin={() => {
          setMenu(null);
          onTogglePinGroup(menuGroup.id);
        }}
      />
    )}
    {open && groupToDelete && (
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
    </SidePanel>
  );
}
