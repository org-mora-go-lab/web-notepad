import { Bookmark, X } from "lucide-react";
import { type DragEvent, useContext } from "react";

import { SavingTabsContext, useI18n } from "@/src/5-shared/hook";

import type { TabItemProps } from "../../type";

// Mobile opens the tab menu with a double tap instead of a right click.
const isTouchLayout = () =>
  window.matchMedia("(max-width: 512px), (pointer: coarse)").matches;

export function TabItem({
  tab,
  active,
  draggingTabId,
  selected,
  dragActive,
  dropTarget,
  onSelect,
  onClose,
  onCycleTabColor,
  onContextMenu,
  onDragStart,
  onDropTargetChange,
  onDrop,
  onDragEnd,
}: TabItemProps) {
  const { t } = useI18n();
  const saving = useContext(SavingTabsContext).includes(tab.id);
  const dirty = tab.content.trim() !== "" && tab.content !== tab.savedContent;
  const markDropTarget = (event: DragEvent<HTMLDivElement>) => {
    if (!dragActive || draggingTabId === tab.id) return;
    event.preventDefault();
    onDropTargetChange(tab.id);
  };

  return (
    <div
      className={`tab-item ${saving ? "is-saving" : ""} ${active ? "is-active" : ""} ${dirty ? "is-dirty" : ""} ${
        draggingTabId === tab.id ? "is-dragging" : ""
      } ${selected ? "is-range-selected" : ""} ${dropTarget ? "is-drop-target" : ""} ${
        tab.bookmarked ? "is-bookmarked" : ""
      }`}
      data-tab-color={tab.tabColor}
      data-dashboard-status={tab.dashboardStatus}
      draggable
      onContextMenu={(event) => {
        event.preventDefault();
        if (isTouchLayout()) return;
        onContextMenu(tab.id, event.clientX, event.clientY);
      }}
      onAuxClick={(event) => {
        if (event.button !== 1) return;
        event.preventDefault();
        onClose(tab.id);
      }}
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", tab.id);
        onDragStart(tab.id);
      }}
      onDragOver={markDropTarget}
      onDragEnter={markDropTarget}
      onDragLeave={() => onDropTargetChange(null)}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onDrop(event.dataTransfer.getData("text/plain"), tab.id);
        onDragEnd();
      }}
      onDragEnd={onDragEnd}
    >
      <button
        className={`dirty-dot ${dirty ? "is-dirty" : ""}`}
        type="button"
        onClick={() => onCycleTabColor(tab.id)}
        aria-label={t.changeTabColorFor(tab.title)}
        title={t.changeTabColor}
      />
      <button
        className="tab-select"
        type="button"
        role="tab"
        aria-label={tab.title}
        aria-selected={active}
        onClick={(event) => onSelect(tab.id, event.shiftKey)}
        onDoubleClick={(event) => {
          if (!isTouchLayout()) return;
          event.preventDefault();
          onContextMenu(tab.id, event.clientX, event.clientY);
        }}
      >
        {tab.bookmarked && (
          <span className="tab-bookmark-indicator" aria-hidden="true">
            <Bookmark
              className="tab-indicator is-bookmark"
              size={13}
              aria-hidden="true"
            />
          </span>
        )}
        <span className="tab-title">{tab.title}</span>
      </button>
        <button
          className="tab-close"
          type="button"
          onClick={() => onClose(tab.id)}
          aria-label={t.closeTabFor(tab.title)}
          title={t.closeTab}
        >
          <X size={11} />
        </button>
    </div>
  );
}
