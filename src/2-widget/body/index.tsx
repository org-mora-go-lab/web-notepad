"use client";

import { NoteEditor } from "@/src/3-feature";
import type { PaneDropZone } from "@/src/5-shared";

import { usePaneDropArea } from "./hook";
import type { BodyProps } from "./type";

export function Body({
  activeTab,
  editorRef,
  composingRef,
  autoFocus,
  draggingTabId,
  dropZones,
  onChange,
}: BodyProps) {
  const dragActive = draggingTabId !== null;
  const dropArea = usePaneDropArea(dragActive, (event) => {
    // A fast drop can arrive on the editor before React has painted the drop overlays.
    const bounds = event.currentTarget.getBoundingClientRect();
    const lowerHalf = event.clientY - bounds.top > bounds.height / 2;
    const rightHalf = event.clientX - bounds.left > bounds.width / 2;
    const bottomZone = dropZones.find((zone) => zone.area === "bottom");
    const rightZone = dropZones.find((zone) => zone.area === "right");
    const adoptZone = dropZones.find((zone) => zone.key === "adopt");
    const target =
      lowerHalf && bottomZone
        ? bottomZone
        : rightHalf && rightZone
          ? rightZone
          : adoptZone;
    target?.onDrop();
  });
  // The bottom split zone only appears once the dragged tab passes the middle of the editor.
  const visibleZones = dropZones.filter(
    (zone) => zone.area !== "bottom" || dropArea.pointerInLowerHalf,
  );
  const hasRightZone = visibleZones.some((zone) => zone.area === "right");
  const hasBottomZone = visibleZones.some((zone) => zone.area === "bottom");
  // Each zone takes its own part of the pane so no label is covered by another zone.
  const zoneClassName = (zone: PaneDropZone) => {
    const area = zone.area ?? "full";
    if (area === "right") return `is-right ${hasBottomZone ? "is-upper" : ""}`;
    if (area === "bottom") return "is-bottom";
    return `is-full ${hasRightZone ? "has-right-split" : ""} ${hasBottomZone ? "has-bottom-split" : ""}`;
  };

  return (
    <div
      className="body"
      onDragEnter={dropArea.handleDragEnter}
      onDragLeave={dropArea.handleDragLeave}
      onDragOver={dropArea.handleDragOver}
      onDrop={dropArea.handleDrop}
    >
      <NoteEditor
        tab={activeTab}
        editorRef={editorRef}
        composingRef={composingRef}
        autoFocus={autoFocus}
        onChange={onChange}
      />
      {dragActive &&
        dropArea.dropAreaHovered &&
        visibleZones.map((zone) => (
          <div
            key={zone.key}
            className={`note-pane-drop ${zoneClassName(zone)}`}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              event.stopPropagation();
              dropArea.clearDropAreaHovered();
              zone.onDrop();
            }}
          >
            <span>{zone.label}</span>
          </div>
        ))}
    </div>
  );
}
