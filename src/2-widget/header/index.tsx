"use client";

import { Plus } from "lucide-react";
import { type RefObject, useState } from "react";

import { compareGroups, type GroupEntry, type NoteTab } from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";

import { AdditionalTools, TabContextMenu, TabItem } from "./component";

type Props = {
  closedCount?: number;
  onOpenClosed?: () => void;
  onOpenSettings?: () => void;
  onOpenShortcuts?: () => void;
  onOpenSearch?: () => void;
  tabs: NoteTab[];
  groups: GroupEntry[];
  activeGroupId: string;
  activeTabId: string;
  tabsScrollRef: RefObject<HTMLDivElement | null>;
  tabsOverflowing: boolean;
  tabsCanScrollLeft: boolean;
  tabsCanScrollRight: boolean;
  draggingTabId: string | null;
  onSelect: (tabId: string) => void;
  onClose: (tabId: string) => void;
  onMove: (fromTabId: string, toTabId: string) => void;
  onMoveToGroup: (tabId: string, groupId: string) => void;
  onAdopt: (tabId: string) => void;
  onDragStateChange: (tabId: string | null) => void;
  onCycleTabColor: (tabId: string) => void;
  onTogglePin: (tabId: string) => void;
  onToggleBookmark: (tabId: string) => void;
  onAdd: () => void;
};

type ContextMenuState = { tabId: string; left: number; top: number };

export function Header({
  closedCount = 0,
  onOpenClosed,
  onOpenSettings,
  onOpenShortcuts,
  onOpenSearch,
  tabs,
  groups,
  activeGroupId,
  activeTabId,
  tabsScrollRef,
  tabsOverflowing,
  tabsCanScrollLeft,
  tabsCanScrollRight,
  draggingTabId,
  onSelect,
  onClose,
  onMove,
  onMoveToGroup,
  onAdopt,
  onDragStateChange,
  onCycleTabColor,
  onTogglePin,
  onToggleBookmark,
  onAdd,
}: Props) {
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const { t } = useI18n();
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const dragActive = draggingTabId !== null;
  const contextTab = tabs.find((tab) => tab.id === contextMenu?.tabId);

  const endDrag = () => {
    setDropTargetId(null);
    onDragStateChange(null);
  };

  const applyDrop = (fromTabId: string, toTabId?: string) => {
    if (!fromTabId) return;
    if (!tabs.some((tab) => tab.id === fromTabId)) {
      onAdopt(fromTabId);
      return;
    }
    if (toTabId && fromTabId !== toTabId) onMove(fromTabId, toTabId);
  };

  return (
    <div
      className={`header ${onOpenShortcuts ? "has-menu" : ""} ${tabsCanScrollLeft ? "has-left-overflow" : ""} ${tabsCanScrollRight ? "has-right-overflow" : ""}`}
      role="tablist"
      aria-label="메모 탭"
      onDragEnter={(event) => {
        if (!dragActive) return;
        event.preventDefault();
      }}
      onDragOver={(event) => {
        if (dragActive) event.preventDefault();
      }}
      onDrop={(event) => {
        event.preventDefault();
        applyDrop(event.dataTransfer.getData("text/plain"));
        endDrag();
      }}
    >
      <div
        className={`tabs-scroll ${tabsOverflowing ? "is-overflowing" : ""}`}
        ref={tabsScrollRef}
      >
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            active={tab.id === activeTabId}
            draggingTabId={draggingTabId}
            dragActive={dragActive}
            dropTarget={dropTargetId === tab.id}
            onSelect={onSelect}
            onClose={onClose}
            onCycleTabColor={onCycleTabColor}
            onContextMenu={(tabId, clientX, clientY) =>
              setContextMenu({
                tabId,
                left: Math.max(8, Math.min(clientX, window.innerWidth - 196)),
                top: Math.max(8, Math.min(clientY, window.innerHeight - 104)),
              })
            }
            onDragStateChange={onDragStateChange}
            onDropTargetChange={(tabId) =>
              setDropTargetId((current) =>
                tabId === null && current !== tab.id ? current : tabId,
              )
            }
            onDrop={applyDrop}
            onDragEnd={endDrag}
          />
        ))}
      </div>
      <button
        className="add-tab"
        type="button"
        onClick={onAdd}
        aria-label="새 탭 추가"
        title={t.newTab}
      >
        <Plus size={14} />
      </button>
      {contextMenu && contextTab && (
        <TabContextMenu
          left={contextMenu.left}
          top={contextMenu.top}
          pinned={contextTab.pinned}
          bookmarked={contextTab.bookmarked}
          targetGroups={groups.filter((group) => group.id !== activeGroupId).sort(compareGroups)}
          onMoveToGroup={(groupId) => {
            onMoveToGroup(contextTab.id, groupId);
            setContextMenu(null);
          }}
          onTogglePin={() => {
            onTogglePin(contextTab.id);
            setContextMenu(null);
          }}
          onToggleBookmark={() => {
            onToggleBookmark(contextTab.id);
            setContextMenu(null);
          }}
          onClose={() => setContextMenu(null)}
        />
      )}
      {onOpenShortcuts && onOpenClosed && onOpenSettings && onOpenSearch && <AdditionalTools
        closedCount={closedCount}
        onOpenClosed={onOpenClosed}
        onOpenSettings={onOpenSettings}
        onOpenShortcuts={onOpenShortcuts}
        onOpenSearch={onOpenSearch}
      />}
    </div>
  );
}
