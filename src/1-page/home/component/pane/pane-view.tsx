"use client";

import { Body, Header } from "@/src/2-widget";

import type { PaneViewProps } from "../../type";

export function PaneView({
  pane,
  hasMenu,
  tabs,
  groups,
  activeGroupId,
  activeTab,
  editorRef,
  composingRef,
  autoFocus,
  isFocused,
  draggingTabId,
  draggingTabIds,
  selectedTabIds,
  dropZones,
  heightRatio,
  onActivate,
  onSelect,
  onClose,
  onMove,
  onMoveToGroup,
  onAdopt,
  onDragStart,
  onDragEnd,
  onCycleTabColor,
  onToggleBookmark,
  onAdd,
  onChange,
}: PaneViewProps) {
  return (
    <div
      className="pane-slot"
      data-pane={pane}
      style={heightRatio ? { flex: `0 0 ${heightRatio * 100}%` } : undefined}
    >
      <div
        className={`note-pane ${isFocused ? "" : "is-unfocused"}`}
        onFocusCapture={onActivate}
        onPointerDownCapture={onActivate}
      >
        <Header
          showAuth={hasMenu}
          tabs={tabs}
          groups={groups}
          activeGroupId={activeGroupId}
          activeTabId={activeTab.id}
          draggingTabId={draggingTabId}
          draggingTabIds={draggingTabIds}
          selectedTabIds={selectedTabIds}
          onSelect={onSelect}
          onClose={onClose}
          onMove={onMove}
          onMoveToGroup={onMoveToGroup}
          onAdopt={onAdopt}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onCycleTabColor={onCycleTabColor}
          onToggleBookmark={onToggleBookmark}
          onAdd={onAdd}
        />
        <Body
          activeTab={activeTab}
          editorRef={editorRef}
          composingRef={composingRef}
          autoFocus={autoFocus}
          draggingTabId={draggingTabId}
          dropZones={dropZones}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
