"use client";

import {
  Bookmark,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Ellipsis,
  Layers,
  Search,
  Settings,
  X,
} from "lucide-react";
import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import {
  ALL_GROUP_ID,
  compareGroups,
  type GroupEntry,
  isSharedGroupId,
  UNGROUPED_GROUP_ID,
  useNotepadStore,
} from "@/src/4-entity/notepad";
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
  onOpenGuide,
  onOpenSettings,
  onToggleBookmarks,
  onToggleSearch,
  searchOpen,
}: GroupMenuProps) {
  const { t } = useI18n();
  const sharing = useContext(GroupSharingContext);
  const [accessAction, setAccessAction] = useState<{
    groupId: string;
    action: "leave" | "revoke";
    anchor: HTMLElement;
  } | null>(null);
  const [accessError, setAccessError] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(false);
  const accessBusy = useRef(false);
  const [sectionsOpen, setSectionsOpen] = useState(() => {
    try {
      const value = JSON.parse(
        localStorage.getItem("web-notepad-group-sections") ?? "null",
      );
      return { my: value?.my !== false, shared: value?.shared !== false };
    } catch {
      return { my: true, shared: true };
    }
  });
  const [myGroupRatio, setMyGroupRatio] = useState(() => {
    try {
      const value = Number(localStorage.getItem("web-notepad-group-split"));
      return Number.isFinite(value) && value >= 20 && value <= 80 ? value : 50;
    } catch {
      return 50;
    }
  });
  const groupListRef = useRef<HTMLDivElement>(null);
  const updateGroupRatio = (ratio: number) => {
    const next = Math.max(20, Math.min(80, ratio));
    setMyGroupRatio(next);
    try {
      localStorage.setItem("web-notepad-group-split", String(next));
    } catch {
      /* Keep the resized sections usable for the current session. */
    }
  };
  const resizeGroupSections = (clientY: number) => {
    const bounds = groupListRef.current?.getBoundingClientRect();
    if (!bounds?.height) return;
    updateGroupRatio(((clientY - bounds.top) / bounds.height) * 100);
  };
  const toggleSection = (section: "my" | "shared") => {
    const next = { ...sectionsOpen, [section]: !sectionsOpen[section] };
    setSectionsOpen(next);
    setActionsGroupId(null);
    try {
      localStorage.setItem("web-notepad-group-sections", JSON.stringify(next));
    } catch {
      /* Keep the current view usable. */
    }
  };
  const sidebarRef = useRef<HTMLDivElement>(null);
  const handleResizeStart = useGroupMenuResize(sidebarRef);
  const reorder = useGroupReorder(onMoveGroup);
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);
  const [actionsGroupId, setActionsGroupId] = useState<string | null>(null);
  const [footerMenuOpen, setFooterMenuOpen] = useState<
    "groups" | "more" | null
  >(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const [sharingGroup, setSharingGroup] = useState<GroupEntry | null>(null);
  const shareFocusTarget = useRef<string | null>(null);
  const closeSharing = useCallback(() => setSharingGroup(null), []);
  const deleteAnchorRef = useRef<HTMLElement | null>(null);
  const groupToDelete = groups.find((group) => group.id === deletingGroupId);
  const ungrouped = groups.find((group) => group.id === UNGROUPED_GROUP_ID);
  const otherRows = [...groups]
    .sort(compareGroups)
    .filter((group) => group.id !== UNGROUPED_GROUP_ID);

  const hasAccess = (group: GroupEntry) =>
    !isSharedGroupId(group.id) || !!sharing?.accessByGroup[group.id];
  const pendingRows = otherRows.filter((group) => !hasAccess(group));
  const isShared = (group: GroupEntry) =>
    isSharedGroupId(group.id) &&
    sharing?.accessByGroup[group.id]?.active === true;
  const accessLoading = sharing?.loading || checkingAccess;

  useEffect(() => {
    if (sharingGroup || !shareFocusTarget.current) return;
    const groupId = shareFocusTarget.current;
    const target = isSharedGroupId(groupId)
      ? ".group-select"
      : ".group-actions > button";
    const button = sidebarRef.current?.querySelector<HTMLButtonElement>(
      `[data-group-id="${CSS.escape(groupId)}"] ${target}`,
    );
    if (button) {
      button.focus();
      shareFocusTarget.current = null;
    }
  }, [groups, sharing?.accessByGroup, sharingGroup]);

  const handleShared = useCallback(
    (originalId: string, sharedGroup: GroupEntry) => {
      shareFocusTarget.current = sharedGroup.id;
      if (originalId !== sharedGroup.id) {
        useNotepadStore.getState().adoptSharedGroup(originalId, sharedGroup);
      }
      window.dispatchEvent(new Event("shared-groups-changed"));
    },
    [],
  );

  const selectGroup = (groupId: string) => {
    onSelect(groupId);
    if (window.matchMedia(MOBILE_QUERY).matches) onClose();
  };

  useEffect(() => {
    if (!footerMenuOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!moreRef.current?.contains(event.target as Node))
        setFooterMenuOpen(null);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [footerMenuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      event.preventDefault();
      if (footerMenuOpen) {
        const trigger =
          footerMenuOpen === "groups"
            ? ".system-group-command"
            : ".more-command";
        setFooterMenuOpen(null);
        moreRef.current?.querySelector<HTMLButtonElement>(trigger)?.focus();
        return;
      }
      onClose();
      document.querySelector<HTMLElement>(ANCHOR_SELECTOR)?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [footerMenuOpen, onClose]);

  return createPortal(
    <div className="group">
      <div
        className="group-sidebar-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        ref={sidebarRef}
        className="group-menu"
        id="groups-menu"
        aria-label={t.sidebarTitle}
      >
        <header className="group-sidebar-header">
          <h2>{t.sidebarTitle}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.closePanel(t.sidebarTitle)}
          >
            <X aria-hidden="true" />
          </button>
        </header>
        <section className="group-section">
          <div
            className="group-list"
            id="group-sidebar-list"
            ref={groupListRef}
          >
            {(["my", "shared"] as const).map((section) => {
              const rows = otherRows.filter(
                (group) =>
                  hasAccess(group) &&
                  isShared(group) === (section === "shared"),
              );
              const label = section === "my" ? t.myGroup : t.shareGroupSection;
              const Icon = sectionsOpen[section] ? ChevronDown : ChevronRight;
              return (
                <Fragment key={section}>
                  <section
                    className="group-category"
                    style={{
                      flexGrow:
                        section === "my" ? myGroupRatio : 100 - myGroupRatio,
                    }}
                  >
                    <h3>
                      <button
                        type="button"
                        className="group-section-toggle"
                        aria-expanded={sectionsOpen[section]}
                        aria-controls={"group-" + section + "-list"}
                        onClick={() => toggleSection(section)}
                      >
                        <span>{label}</span>
                        <Icon size={16} aria-hidden="true" />
                      </button>
                    </h3>
                    <div
                      className="group-section-list"
                      id={"group-" + section + "-list"}
                      hidden={!sectionsOpen[section]}
                    >
                      {section === "shared" &&
                        (pendingRows.length > 0 ||
                          (accessLoading && rows.length === 0)) && (
                          <div
                            className="group-access-status"
                            aria-busy={!!accessLoading}
                          >
                            {accessLoading ? (
                              <div
                                className="group-access-skeleton"
                                role="status"
                                aria-label={t.sharedGroupsLoading}
                              >
                                <span aria-hidden="true" />
                                <span aria-hidden="true" />
                              </div>
                            ) : (
                              <div className="group-access-error" role="status">
                                <p>{t.sharedGroupsUnavailable}</p>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    setCheckingAccess(true);
                                    try {
                                      await sharing?.refreshGroups();
                                    } finally {
                                      setCheckingAccess(false);
                                    }
                                  }}
                                >
                                  {t.boardRetry}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      {rows.map((group) => (
                        <GroupItem
                          key={group.id}
                          groupId={group.id}
                          shared={isSharedGroupId(group.id)}
                          hideActionsButton={section === "shared"}
                          sharingRole={sharing?.accessByGroup[group.id]?.role}
                          sharingActive={
                            sharing?.accessByGroup[group.id]?.active
                          }
                          onChangeSharing={(action, anchor) => {
                            setAccessError(false);
                            setAccessAction({
                              groupId: group.id,
                              action,
                              anchor,
                            });
                          }}
                          dragging={reorder.draggingId === group.id}
                          dropTarget={reorder.targetId === group.id}
                          onReorderStart={(event) =>
                            reorder.start(group.id, event)
                          }
                          onReorderKey={(direction) => {
                            const peers = otherRows.filter(
                              (item) =>
                                item.pinned === group.pinned &&
                                isShared(item) === isShared(group),
                            );
                            const target =
                              peers[
                                peers.findIndex(
                                  (item) => item.id === group.id,
                                ) + direction
                              ];
                            if (target) onMoveGroup(group.id, target.id);
                          }}
                          name={group.name}
                          active={group.id === activeGroupId}
                          pinned={group.pinned}
                          editable
                          muted={false}
                          actionsOpen={actionsGroupId === group.id}
                          onToggleActions={() =>
                            setActionsGroupId((current) =>
                              current === group.id ? null : group.id,
                            )
                          }
                          onSelect={() => selectGroup(group.id)}
                          onRename={(name) => onRename(group.id, name)}
                          onTogglePin={() => onTogglePinGroup(group.id)}
                          onDelete={(anchor) => {
                            deleteAnchorRef.current = anchor;
                            setDeletingGroupId(group.id);
                          }}
                          onShare={() => {
                            shareFocusTarget.current = group.id;
                            setSharingGroup(group);
                          }}
                        />
                      ))}
                      {rows.length === 0 &&
                        (section === "my" ||
                          (pendingRows.length === 0 && !accessLoading)) && (
                          <p className="group-section-empty">
                            {section === "my" ? t.noMyGroups : t.noSharedGroups}
                          </p>
                        )}
                    </div>
                  </section>
                  {section === "my" && (
                    <div
                      className="group-section-resizer"
                      role="separator"
                      aria-orientation="horizontal"
                      aria-label={t.resizeGroupSections}
                      aria-valuemin={20}
                      aria-valuemax={80}
                      aria-valuenow={Math.round(myGroupRatio)}
                      tabIndex={0}
                      style={{ top: `${myGroupRatio}%` }}
                      onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        resizeGroupSections(event.clientY);
                      }}
                      onPointerMove={(event) => {
                        if (
                          event.currentTarget.hasPointerCapture(event.pointerId)
                        )
                          resizeGroupSections(event.clientY);
                      }}
                      onKeyDown={(event) => {
                        const next =
                          event.key === "ArrowUp"
                            ? myGroupRatio - 5
                            : event.key === "ArrowDown"
                              ? myGroupRatio + 5
                              : event.key === "Home"
                                ? 20
                                : event.key === "End"
                                  ? 80
                                  : null;
                        if (next === null) return;
                        event.preventDefault();
                        updateGroupRatio(next);
                      }}
                    />
                  )}
                </Fragment>
              );
            })}
          </div>
        </section>
        <div className="group-more" ref={moreRef}>
          <button
            className="system-group-command"
            type="button"
            aria-expanded={footerMenuOpen === "groups"}
            aria-controls="group-system-menu"
            aria-haspopup="menu"
            onClick={() =>
              setFooterMenuOpen((current) =>
                current === "groups" ? null : "groups",
              )
            }
          >
            <Layers size={18} strokeWidth={1.8} aria-hidden="true" />
            <span>{t.group}</span>
          </button>
          {footerMenuOpen === "groups" && (
            <div
              className="group-system-menu"
              id="group-system-menu"
              role="menu"
            >
              <button
                type="button"
                aria-pressed={activeGroupId === ALL_GROUP_ID}
                onClick={() => {
                  setFooterMenuOpen(null);
                  selectGroup(ALL_GROUP_ID);
                }}
              >
                <Layers size={18} aria-hidden="true" />
                <span>{t.allGroup}</span>
              </button>
              {ungrouped && (
                <button
                  type="button"
                  aria-pressed={activeGroupId === UNGROUPED_GROUP_ID}
                  onClick={() => {
                    setFooterMenuOpen(null);
                    selectGroup(UNGROUPED_GROUP_ID);
                  }}
                >
                  <Layers size={18} aria-hidden="true" />
                  <span>{ungrouped.name}</span>
                </button>
              )}
              <GroupCreateForm
                onCreate={(name) => {
                  if (!sectionsOpen.my) toggleSection("my");
                  onCreate(name);
                }}
              />
            </div>
          )}
          <span className="group-more-divider" aria-hidden="true" />
          <button
            className="more-command"
            type="button"
            aria-expanded={footerMenuOpen === "more"}
            aria-controls="group-more-menu"
            aria-haspopup="menu"
            onClick={() =>
              setFooterMenuOpen((current) =>
                current === "more" ? null : "more",
              )
            }
          >
            <Ellipsis size={25} strokeWidth={1.8} aria-hidden="true" />
            <span>{t.more}</span>
          </button>
          {footerMenuOpen === "more" && (
            <div className="group-more-menu" id="group-more-menu" role="menu">
              <button
                type="button"
                onClick={() => {
                  setFooterMenuOpen(null);
                  onClose();
                  onOpenGuide();
                }}
              >
                <BookOpen size={18} aria-hidden="true" />
                <span>{t.guide}</span>
              </button>
              <button
                className="global-search-command"
                type="button"
                aria-expanded={searchOpen}
                aria-controls="global-search-popup"
                aria-haspopup="dialog"
                onClick={() => {
                  setFooterMenuOpen(null);
                  onClose();
                  onToggleSearch();
                }}
              >
                <Search size={18} aria-hidden="true" />
                <span>{t.search}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFooterMenuOpen(null);
                  onClose();
                  onToggleBookmarks();
                }}
              >
                <Bookmark size={18} aria-hidden="true" />
                <span>{t.bookmark}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFooterMenuOpen(null);
                  onClose();
                  onOpenSettings();
                }}
              >
                <Settings size={18} aria-hidden="true" />
                <span>{t.settings}</span>
              </button>
            </div>
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
      {accessAction && (
        <>
          <ConfirmPopup
            title={
              accessAction.action === "leave"
                ? t.leaveGroup
                : t.revokeGroupShare
            }
            message={
              accessAction.action === "leave"
                ? t.leaveGroupMessage
                : t.revokeGroupShareMessage
            }
            closeLabel={t.close}
            closeTitle={t.close}
            confirmLabel={
              accessAction.action === "leave"
                ? t.leaveGroup
                : t.revokeGroupShare
            }
            keepOpenOnConfirm
            error={accessError ? t.groupAccessError : undefined}
            onCancel={() => {
              setAccessAction(null);
              accessAction.anchor.focus();
            }}
            onConfirm={async () => {
              if (accessBusy.current || !sharing) return;
              accessBusy.current = true;
              setAccessError(false);
              try {
                if (
                  await sharing.changeAccess(
                    accessAction.groupId,
                    accessAction.action,
                  )
                ) {
                  setAccessAction(null);
                  accessAction.anchor.focus();
                } else setAccessError(true);
              } finally {
                accessBusy.current = false;
              }
            }}
          />
        </>
      )}
      {sharingGroup && (
        <GroupShareDialog
          group={sharingGroup}
          onClose={closeSharing}
          onShared={handleShared}
        />
      )}
    </div>,
    document.body,
  );
}

export function Group({ open, ...props }: GroupProps) {
  return open ? <GroupSidebar open={open} {...props} /> : null;
}
