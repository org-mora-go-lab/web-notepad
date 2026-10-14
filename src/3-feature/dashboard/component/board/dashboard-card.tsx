"use client";

import { Bookmark, Pin } from "lucide-react";

import {
  type NoteTab,
  TAB_STATUSES,
  type TabStatus,
} from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";

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
  closed = false,
  groupName,
  status,
  dragging,
  active = false,
  onOpen,
  onDragStart,
  onChangeStatus,
  onDragEnd,
}: DashboardCardProps) {
  const preview = getPreview(tab);
  const { t } = useI18n();
  const statusLabels: Record<TabStatus, string> = {
    todo: t.statusTodo,
    "in-progress": t.statusInProgress,
    done: t.statusDone,
  };
  const itemId = id ?? tab.id;

  return (
    <article
      className={`dashboard-card ${dragging ? "is-dragging" : ""} ${active ? "is-active" : ""}`}
      data-tab-color={tab.tabColor}
      draggable
      onDragStart={(event) => onDragStart(itemId, closed, event)}
      onDragEnd={onDragEnd}
    >
      <button
        className="dashboard-card-open"
        type="button"
        aria-current={active ? "true" : undefined}
        onClick={() => onOpen(tab.id)}
      >
        <strong title={tab.title}>{tab.title}</strong>
        {groupName && <span className="dashboard-card-group">{groupName}</span>}
        {preview && <span className="dashboard-card-preview">{preview}</span>}
      </button>
      {(tab.pinned || tab.bookmarked) && (
        <span className="dashboard-card-indicators">
          {tab.pinned && (
            <span
              className="dashboard-card-pin"
              role="img"
              aria-label={t.pinned}
            >
              <Pin size={14} strokeWidth={1.8} />
            </span>
          )}
          {tab.bookmarked && (
            <span
              className="dashboard-card-bookmark"
              role="img"
              aria-label={t.bookmarked}
            >
              <Bookmark size={14} fill="currentColor" strokeWidth={1.8} />
            </span>
          )}
        </span>
      )}
      <div
        className="dashboard-card-status-actions"
        role="group"
        aria-label={t.changeTabStatus(tab.title)}
      >
        {TAB_STATUSES.map((nextStatus) => (
          <button
            key={nextStatus}
            type="button"
            aria-pressed={nextStatus === status}
            onClick={() => {
              if (nextStatus !== status)
                onChangeStatus(itemId, closed, nextStatus);
            }}
          >
            {statusLabels[nextStatus]}
          </button>
        ))}
      </div>
    </article>
  );
}
