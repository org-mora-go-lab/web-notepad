"use client";

import type { DragEvent } from "react";

import type { NoteTab } from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";

type Props = {
  tab: NoteTab;
  // Drag identity; defaults to the tab id (closed entries pass their entry id).
  id?: string;
  groupName?: string;
  dragging: boolean;
  onOpen: (tabId: string) => void;
  onDragStart: (tabId: string, event: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
};

// The note text after its title line, used as the card preview.
const getPreview = (tab: NoteTab) => {
  const lines = tab.content.split("\n");
  const titleIndex = lines.findIndex((line) => line.trim());
  return titleIndex < 0 ? "" : lines.slice(titleIndex + 1).join("\n").trim();
};

export function DashboardCard({ id, tab, groupName, dragging, onOpen, onDragStart, onDragEnd }: Props) {
  const { t } = useI18n();
  const preview = getPreview(tab);

  return (
    <article
      className={`dashboard-card ${dragging ? "is-dragging" : ""}`}
      data-tab-color={tab.tabColor}
      draggable
      onDragStart={(event) => onDragStart(id ?? tab.id, event)}
      onDragEnd={onDragEnd}
    >
      <button className="dashboard-card-open" type="button" onClick={() => onOpen(tab.id)}>
        <strong>{tab.content.trim() ? tab.title : t.emptyNote}</strong>
        {groupName && <span className="dashboard-card-group">{groupName}</span>}
        {preview && <span className="dashboard-card-preview">{preview}</span>}
      </button>
    </article>
  );
}
