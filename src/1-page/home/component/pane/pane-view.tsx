"use client";

import { Body, Header } from "@/src/2-widget";

import type { PaneViewProps } from "../../type";

export function PaneView({
  pane,
  onOpenSettings,
  onOpenShortcuts,
  onOpenSearch,
  tabs,
  groups,
  activeGroupId,
  activeTab,
  editorRef,
  composingRef,
  autoFocus,
  isFocused,
  draggingTabId,
  dropZones,
  heightRatio,
  onActivate,
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
          onOpenSettings={onOpenSettings}
          onOpenShortcuts={onOpenShortcuts}
          onOpenSearch={onOpenSearch}
          tabs={tabs}
          groups={groups}
          activeGroupId={activeGroupId}
          activeTabId={activeTab.id}
          draggingTabId={draggingTabId}
          onSelect={onSelect}
          onClose={onClose}
          onMove={onMove}
          onMoveToGroup={onMoveToGroup}
          onAdopt={onAdopt}
          onDragStateChange={onDragStateChange}
          onCycleTabColor={onCycleTabColor}
          onTogglePin={onTogglePin}
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
