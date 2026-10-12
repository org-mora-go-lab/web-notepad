"use client";

import type { RefObject } from "react";

import { NoteEditor } from "@/src/3-feature";
import type { NoteTab } from "@/src/4-entity/notepad";
import type { PaneDropZone } from "@/src/5-shared";

import { usePaneDropArea } from "./hook";

type Props = {
  activeTab: NoteTab;
  editorRef: RefObject<HTMLTextAreaElement | null>;
  composingRef: RefObject<boolean>;
  autoFocus?: boolean;
  draggingTabId: string | null;
  dropZones: PaneDropZone[];
  onChange: (content: string) => void;
};

export function Body({
  activeTab,
  editorRef,
  composingRef,
  autoFocus,
  draggingTabId,
  dropZones,
  onChange,
}: Props) {
  const dragActive = draggingTabId !== null;
  const adoptZone = dropZones.find((zone) => zone.key === "adopt");
  const hasRightZone = dropZones.some((zone) => zone.area === "right");
  const hasBottomZone = dropZones.some((zone) => zone.area === "bottom");
  // Each zone takes its own part of the pane so no label is covered by another zone.
  const zoneClassName = (zone: PaneDropZone) => {
    const area = zone.area ?? "full";
    if (area === "right") return `is-right ${hasBottomZone ? "is-upper" : ""}`;
    if (area === "bottom") return "is-bottom";
    return `is-full ${hasRightZone ? "has-right-split" : ""} ${hasBottomZone ? "has-bottom-split" : ""}`;
  };
  const dropArea = usePaneDropArea(dragActive, () => adoptZone?.onDrop());

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
      {dragActive && dropArea.dropAreaHovered &&
        dropZones.map((zone) => (
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
