"use client";

import { Body, Header } from "@/src/2-widget";

import type { PaneViewProps } from "../type";

type Props = PaneViewProps & {
  heightRatio?: number;
};

export function PaneView({
  pane,
  closedCount,
  onOpenClosed,
  onOpenShortcuts,
  tabs,
  groups,
  activeGroupId,
  activeTab,
  tabStrip,
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
}: Props) {
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
          closedCount={closedCount}
          onOpenClosed={onOpenClosed}
          onOpenShortcuts={onOpenShortcuts}
          tabs={tabs}
          groups={groups}
          activeGroupId={activeGroupId}
          activeTabId={activeTab.id}
          tabsScrollRef={tabStrip.tabsScrollRef}
          tabsOverflowing={tabStrip.tabsOverflowing}
          tabsCanScrollLeft={tabStrip.tabsCanScrollLeft}
          tabsCanScrollRight={tabStrip.tabsCanScrollRight}
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
