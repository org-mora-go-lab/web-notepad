"use client";

import { Bookmark, Pin } from "lucide-react";

import type { NoteTab } from "@/src/4-entity/notepad";

import type { DashboardCardProps } from "../../type";

// The note text after its title line, used as the card preview.
const getPreview = (tab: NoteTab) => {
  const lines = tab.content.split("\n");
  const titleIndex = lines.findIndex((line) => line.trim());
  return titleIndex < 0
    ? ""
    : lines
        .slice(titleIndex + 1)
        .join("\n")
        .trim();
};

export function DashboardCard({
  id,
  tab,
  groupName,
  dragging,
  active = false,
  onOpen,
  onDragStart,
  onDragEnd,
}: DashboardCardProps) {
  const preview = getPreview(tab);

  return (
    <article
      className={`dashboard-card ${dragging ? "is-dragging" : ""} ${active ? "is-active" : ""}`}
      data-tab-color={tab.tabColor}
      draggable
      onDragStart={(event) => onDragStart(id ?? tab.id, event)}
      onDragEnd={onDragEnd}
    >
      <button
        className="dashboard-card-open"
        type="button"
        aria-current={active ? "true" : undefined}
        onClick={() => onOpen(tab.id)}
      >
        <strong>{tab.title}</strong>
        {groupName && <span className="dashboard-card-group">{groupName}</span>}
        {preview && <span className="dashboard-card-preview">{preview}</span>}
      </button>
      {(tab.pinned || tab.bookmarked) && (
        <span className="dashboard-card-indicators">
          {tab.pinned && (
            <span className="dashboard-card-pin" role="img" aria-label="고정됨">
              <Pin size={14} strokeWidth={1.8} />
            </span>
          )}
          {tab.bookmarked && (
            <span
              className="dashboard-card-bookmark"
              role="img"
              aria-label="북마크됨"
            >
              <Bookmark size={14} fill="currentColor" strokeWidth={1.8} />
            </span>
          )}
        </span>
      )}
    </article>
  );
}
