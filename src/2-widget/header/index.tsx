"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { compareGroups } from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";
import { TabContextMenu } from "@/src/5-shared/ui";

import { AdditionalTools, TabItem } from "./component";
import { useTabStrip } from "./hook";
import type { HeaderProps } from "./type";

type ContextMenuState = { tabId: string; left: number; top: number };

export function Header({
  onOpenSettings,
  onOpenShortcuts,
  onSelectGroup,
  tabs,
  groups,
  activeGroupId,
  activeTabId,
  draggingTabId,
  draggingTabIds,
  selectedTabIds,
  onSelect,
  onClose,
  onMove,
  onMoveToGroup,
  onAdopt,
  onDragStart,
  onDragEnd,
  onCycleTabColor,
  onTogglePin,
  onToggleBookmark,
  onAdd,
}: HeaderProps) {
  const {
    tabsScrollRef,
    tabsOverflowing,
    tabsCanScrollLeft,
    tabsCanScrollRight,
  } = useTabStrip(tabs.length, activeTabId);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const { t } = useI18n();
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const dragActive = draggingTabId !== null;
  const contextTab = tabs.find((tab) => tab.id === contextMenu?.tabId);
  const contextGroupId = contextTab
    ? (groups.find((group) =>
        group.tabs.some((tab) => tab.id === contextTab.id),
      )?.id ?? activeGroupId)
    : activeGroupId;

  const endDrag = () => {
    setDropTargetId(null);
    onDragEnd();
  };

  const applyDrop = (fromTabId: string, toTabId?: string) => {
    if (!fromTabId) return;
    if (!tabs.some((tab) => tab.id === fromTabId)) {
      onAdopt(fromTabId);
      return;
    }
    if (toTabId && !draggingTabIds.includes(toTabId))
      onMove(
        draggingTabIds.includes(fromTabId) ? draggingTabIds : [fromTabId],
        toTabId,
      );
  };

  return (
    <div
      className={`header ${onOpenShortcuts ? "has-menu" : ""} ${tabsCanScrollLeft ? "has-left-overflow" : ""} ${tabsCanScrollRight ? "has-right-overflow" : ""}`}
      role="tablist"
      aria-label={t.noteTabs}
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
            selected={selectedTabIds.includes(tab.id)}
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
            onDragStart={onDragStart}
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
        aria-label={t.newTab}
        title={t.newTab}
      >
        <Plus size={14} />
      </button>
      {contextMenu && contextTab && (
        <TabContextMenu
          left={contextMenu.left}
          top={contextMenu.top}
          pinned={contextTab.pinned}
          showPin={false}
          bookmarked={contextTab.bookmarked}
          targetGroups={groups
            .filter((group) => group.id !== contextGroupId)
            .sort(compareGroups)}
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
      {onOpenShortcuts && onOpenSettings && onSelectGroup && (
        <AdditionalTools
          onOpenSettings={onOpenSettings}
          onOpenShortcuts={onOpenShortcuts}
          onSelectGroup={onSelectGroup}
        />
      )}
    </div>
  );
}
