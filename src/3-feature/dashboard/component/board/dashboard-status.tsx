"use client";

import { Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useI18n } from "@/src/5-shared/hook";

import type { DashboardStatusProps } from "../../type";

export function DashboardStatus({
  id,
  className = "",
  status,
  label,
  count,
  tabColor,
  onRename,
}: DashboardStatusProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(label);
  const [mobileActionsVisible, setMobileActionsVisible] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { t } = useI18n();

  const clearHideTimer = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = null;
  };
  const revealMobileAction = () => {
    if (!window.matchMedia("(max-width: 640px), (pointer: coarse)").matches)
      return;
    clearHideTimer();
    setMobileActionsVisible(true);
    hideTimerRef.current = setTimeout(
      () => setMobileActionsVisible(false),
      2000,
    );
  };
  const startEditing = () => {
    clearHideTimer();
    setMobileActionsVisible(false);
    setDraft(label);
    setEditing(true);
  };
  const save = () => {
    const nextName = draft.trim();
    if (nextName) onRename(status, nextName);
    setEditing(false);
  };

  useEffect(() => clearHideTimer, []);

  return (
    <h3
      className={`${className} ${mobileActionsVisible ? "is-actions-visible" : ""}`}
      id={id}
      data-status={status}
      data-tab-color={tabColor}
      onClick={revealMobileAction}
    >
      {editing ? (
        <input
          className="dashboard-status-input"
          value={draft}
          maxLength={30}
          aria-label={t.editDashboardStatus(label)}
          autoFocus
          onFocus={(event) => event.currentTarget.select()}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={save}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              save();
            }
            if (event.key === "Escape") {
              event.preventDefault();
              setDraft(label);
              setEditing(false);
            }
          }}
        />
      ) : (
        <span className="dashboard-status-label">{label}</span>
      )}
      <span className="dashboard-status-actions">
        {!editing && (
          <button
            className="dashboard-status-edit"
            type="button"
            aria-label={t.editDashboardStatus(label)}
            title={t.edit}
            onClick={(event) => {
              event.stopPropagation();
              startEditing();
            }}
          >
            <Pencil size={14} strokeWidth={1.8} />
          </button>
        )}
        <span className="dashboard-count">{count}</span>
      </span>
    </h3>
  );
}
