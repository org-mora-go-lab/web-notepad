"use client";

import { Bookmark, Layers } from "lucide-react";
import { useRef } from "react";

import { useI18n } from "@/src/5-shared/hook";

import { useIsMultiline } from "./hook";

type Props = {
  // A linked bookmark was created or synced today.
  hasBookmarkUpdateToday: boolean;
  bookmarksOpen: boolean;
  activeGroupName: string;
  groupsOpen: boolean;
  onToggleBookmarks: () => void;
  onToggleGroups: () => void;
};

export function Footer({
  hasBookmarkUpdateToday,
  bookmarksOpen,
  activeGroupName,
  groupsOpen,
  onToggleBookmarks,
  onToggleGroups,
}: Props) {
  const { t } = useI18n();
  const groupNameRef = useRef<HTMLSpanElement>(null);
  const groupNameMultiline = useIsMultiline(groupNameRef, activeGroupName);
  return (
    <footer className="footer">
      <div className="status-meta">
        <div className="status-controls">
          <button
            className={`status-command group-status-command ${groupsOpen ? "is-active" : ""}`}
            type="button"
            onClick={onToggleGroups}
            aria-expanded={groupsOpen}
            aria-controls="groups-panel"
            aria-label={`그룹 선택: ${activeGroupName}`}
            title={activeGroupName}
          >
            <span
              ref={groupNameRef}
              className={`group-status-name ${groupNameMultiline ? "is-multiline" : ""}`}
              title={activeGroupName}
            >
              {activeGroupName}
            </span>
          </button>
          <div className="status-scroll-area">
            <div className="status-actions">
              <button
                className={`status-command bookmark-command ${bookmarksOpen ? "is-active" : ""}`}
                type="button"
                onClick={onToggleBookmarks}
                aria-expanded={bookmarksOpen}
                aria-controls="bookmarks-panel"
              >
                <span className="status-icon">
                  <Bookmark size={16} strokeWidth={1.8} />
                  {hasBookmarkUpdateToday && (
                    <span className="status-dot" role="img" aria-label="오늘 업데이트됨" />
                  )}
                </span>
                <span className="status-label">{t.bookmark}</span>
                <span className="status-separator" aria-hidden="true">
                  |
                </span>
              </button>
            </div>
          </div>
          <button
            className={`status-command group-select-command ${groupsOpen ? "is-active" : ""}`}
            type="button"
            onClick={onToggleGroups}
            aria-expanded={groupsOpen}
            aria-controls="groups-panel"
            aria-label="그룹 선택"
            title={t.selectGroup}
          >
            <Layers size={16} strokeWidth={1.8} />
            <span className="status-label group-select-label">{t.group}</span>
            <span className="status-label group-select-name" title={activeGroupName}>{activeGroupName}</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
