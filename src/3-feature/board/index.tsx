"use client";

import {
  ArrowUpRight,
  Bookmark,
  CalendarClock,
  CircleUserRound,
  Clipboard,
  Layers,
  LogOut,
  NotebookPen,
  Unlink,
  Users,
} from "lucide-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { GroupSharingContext, useI18n } from "@/src/5-shared/hook";
import { ConfirmPopup, FixedPageHeader, SearchField } from "@/src/5-shared/ui";

import { useBoard, useBoardSelection } from "./hook";

export function Board({ onReturnHome }: { onReturnHome?: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { t, language } = useI18n();
  const { posts, loading, error, reload } = useBoard();
  const { selected, select, back: backSelection } = useBoardSelection(posts);
  const sharing = useContext(GroupSharingContext);
  const [accessConfirm, setAccessConfirm] = useState(false);
  const [accessError, setAccessError] = useState(false);
  const accessBusy = useRef(false);
  const actionRef = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState("");
  const [failure, setFailure] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [notePreviewHeight, setNotePreviewHeight] = useState(316.8);
  const notePreviewRef = useRef<HTMLElement>(null);
  const noteResizeStart = useRef<{ y: number; height: number } | null>(null);
  const noteSwipeStart = useRef<{ x: number; y: number } | null>(null);
  const noteTabFocusRequested = useRef(false);
  const noteTabsRef = useRef<HTMLDivElement>(null);
  const [noteTabFog, setNoteTabFog] = useState({ left: false, right: false });
  const orderedNotes = selected
    ? [...selected.notes].sort(
        (left, right) =>
          Number(right.bookmarked) - Number(left.bookmarked) ||
          left.title.localeCompare(right.title, language, {
            numeric: true,
            sensitivity: "base",
          }),
      )
    : [];
  const activeNote =
    orderedNotes.find((note) => note.id === activeNoteId) ?? orderedNotes[0];
  const updateNoteTabFog = useCallback(() => {
    const tabs = noteTabsRef.current;
    if (!tabs) return;
    const overflowing = tabs.scrollWidth > tabs.clientWidth + 1;
    const next = {
      left: overflowing && tabs.scrollLeft > 1,
      right:
        overflowing &&
        tabs.scrollLeft + tabs.clientWidth < tabs.scrollWidth - 1,
    };
    setNoteTabFog((current) =>
      current.left === next.left && current.right === next.right
        ? current
        : next,
    );
  }, []);
  useEffect(() => {
    const tabs = noteTabsRef.current;
    if (!tabs) return;
    updateNoteTabFog();
    tabs.addEventListener("scroll", updateNoteTabFog, { passive: true });
    const observer = new ResizeObserver(updateNoteTabFog);
    observer.observe(tabs);
    return () => {
      tabs.removeEventListener("scroll", updateNoteTabFog);
      observer.disconnect();
    };
  }, [orderedNotes.length, selected?.id, updateNoteTabFog]);
  useEffect(() => {
    if (!noteTabFocusRequested.current) return;
    noteTabFocusRequested.current = false;
    const tabs = noteTabsRef.current;
    const activeTab = tabs?.querySelector<HTMLButtonElement>(
      '[role="tab"][aria-selected="true"]',
    );
    if (!tabs || !activeTab) return;
    activeTab.focus({ preventScroll: true });
    const tabLeft = activeTab.offsetLeft;
    const tabRight = tabLeft + activeTab.offsetWidth;
    if (tabLeft < tabs.scrollLeft) tabs.scrollLeft = tabLeft;
    else if (tabRight > tabs.scrollLeft + tabs.clientWidth)
      tabs.scrollLeft = tabRight - tabs.clientWidth;
    const frame = requestAnimationFrame(updateNoteTabFog);
    return () => cancelAnimationFrame(frame);
  }, [activeNote?.id, updateNoteTabFog]);
  useEffect(() => {
    if (!selected?.id || !activeNote?.id) return;
    const updateMobilePreviewHeight = () => {
      if (!window.matchMedia("(max-width: 512px)").matches) return;
      const preview = notePreviewRef.current;
      if (!preview) return;
      const page = preview.closest<HTMLElement>(".board-page");
      const footer = document.querySelector<HTMLElement>(
        ".board-mobile-footer",
      );
      const viewportHeight =
        window.visualViewport?.height ?? window.innerHeight;
      const previewTop =
        preview.getBoundingClientRect().top + (page?.scrollTop ?? 0);
      const footerHeight = footer?.getBoundingClientRect().height ?? 0;
      setNotePreviewHeight(
        Math.max(316.8, viewportHeight - previewTop - footerHeight - 20),
      );
    };
    const frame = requestAnimationFrame(updateMobilePreviewHeight);
    window.addEventListener("resize", updateMobilePreviewHeight);
    window.visualViewport?.addEventListener(
      "resize",
      updateMobilePreviewHeight,
    );
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateMobilePreviewHeight);
      window.visualViewport?.removeEventListener(
        "resize",
        updateMobilePreviewHeight,
      );
    };
  }, [activeNote?.id, selected?.id]);
  useEffect(() => {
    const clearFeedback = () => {
      setFailure("");
      setCopied(false);
    };
    window.addEventListener("popstate", clearFeedback);
    return () => window.removeEventListener("popstate", clearFeedback);
  }, []);
  const filtered = posts.filter((post) =>
    `${post.title} ${post.description} ${post.groupName}`
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase()),
  );

  const selectedRole =
    selected && posts.find((post) => post.id === selected.id)?.viewerRole;
  const accessLabel =
    selectedRole === "owner" ? t.revokeGroupShare : t.leaveGroup;
  const back = () => {
    backSelection();
    setFailure("");
    setCopied(false);
  };

  return (
    <section className="board">
      <FixedPageHeader
        backLabel={selected ? t.boardBack : t.myPageHome}
        className={`board-page-header ${selected ? "is-detail" : "is-list"}`}
        onBack={selected ? back : undefined}
        onNavigateBack={onReturnHome}
        title={selected?.groupName ?? t.boardTitle}
      />
      <div
        className="board-content"
        ref={contentRef}
        aria-busy={loading}
        onKeyDown={(event) => {
          if (
            event.key !== "Escape" &&
            (event.target instanceof HTMLInputElement ||
              event.target instanceof HTMLTextAreaElement)
          )
            event.stopPropagation();
        }}
      >
        {selected ? (
          <article className="board-detail">
            <header
              className="board-detail-hero board-overview"
              aria-labelledby="board-overview-title"
            >
              <div className="board-overview-header">
                <h4 id="board-overview-title">{t.boardOverview}</h4>
                <div className="board-overview-owner">
                  <span className="board-role">
                    {selectedRole === "owner"
                      ? t.boardOwnerRole
                      : selectedRole === "member"
                        ? t.boardMemberRole
                        : t.boardGuestRole}
                  </span>
                  <span
                    className="board-owner"
                    aria-label={t.boardOwnerColumn}
                    title={selected.ownerName || t.boardUnknownOwner}
                  >
                    <CircleUserRound size={16} aria-hidden="true" />
                    <span>{selected.ownerName || t.boardUnknownOwner}</span>
                  </span>
                </div>
              </div>
              <div className="board-meta">
                <span>
                  <NotebookPen size={18} aria-hidden="true" />
                  <small>{t.boardNotesColumn}</small>
                  <strong>{selected.noteCount}</strong>
                </span>
                <span>
                  <Users size={18} aria-hidden="true" />
                  <small>{t.boardMembersColumn}</small>
                  <strong>{selected.memberCount}</strong>
                </span>
                <span>
                  <Bookmark size={18} aria-hidden="true" />
                  <small>{t.boardBookmarksColumn}</small>
                  <strong>{selected.bookmarkCount}</strong>
                </span>
                <span>
                  <CalendarClock size={18} aria-hidden="true" />
                  <small>{t.boardUpdatedColumn}</small>
                  <strong>
                    <time dateTime={new Date(selected.updatedAt).toISOString()}>
                      {new Date(selected.updatedAt).toLocaleDateString(
                        language === "ko" ? "ko-KR" : "en-US",
                      )}
                    </time>
                  </strong>
                </span>
              </div>
            </header>
            <section className="board-detail-section board-note-contents">
              <div
                className={`board-note-tabs ${noteTabFog.left ? "has-left-fog" : ""} ${noteTabFog.right ? "has-right-fog" : ""}`}
                ref={noteTabsRef}
                role="tablist"
                aria-label={t.boardNoteContents}
              >
                {orderedNotes.map((note) => (
                  <button
                    key={note.id}
                    type="button"
                    className={note.bookmarked ? "is-bookmarked" : undefined}
                    role="tab"
                    aria-selected={note.id === activeNote?.id}
                    aria-controls="board-active-note"
                    onClick={() => setActiveNoteId(note.id)}
                  >
                    {note.bookmarked && (
                      <Bookmark
                        className="board-note-bookmark"
                        size={14}
                        aria-hidden="true"
                      />
                    )}
                    <span className="board-note-title">{note.title}</span>
                  </button>
                ))}
              </div>
              {activeNote && (
                <div className="board-note-preview-shell">
                  <article
                    ref={notePreviewRef}
                    className="board-note-preview"
                    id="board-active-note"
                    role="tabpanel"
                    style={{ height: notePreviewHeight }}
                    onTouchStart={(event) => {
                      if (
                        !window.matchMedia("(max-width: 512px)").matches ||
                        event.touches.length !== 1
                      )
                        return;
                      noteSwipeStart.current = {
                        x: event.touches[0].clientX,
                        y: event.touches[0].clientY,
                      };
                    }}
                    onTouchEnd={(event) => {
                      const start = noteSwipeStart.current;
                      noteSwipeStart.current = null;
                      const touch = event.changedTouches[0];
                      if (!start || !touch || orderedNotes.length < 2) return;
                      const horizontal = touch.clientX - start.x;
                      const vertical = touch.clientY - start.y;
                      if (
                        Math.abs(horizontal) < 50 ||
                        Math.abs(horizontal) <= Math.abs(vertical)
                      )
                        return;
                      const current = orderedNotes.findIndex(
                        (note) => note.id === activeNote.id,
                      );
                      const direction = horizontal < 0 ? 1 : -1;
                      const next =
                        (current + direction + orderedNotes.length) %
                        orderedNotes.length;
                      noteTabFocusRequested.current = true;
                      setActiveNoteId(orderedNotes[next].id);
                    }}
                    onTouchCancel={() => {
                      noteSwipeStart.current = null;
                    }}
                  >
                    <pre>
                      {activeNote.content.split("\n").map((line, index) => (
                        <span
                          className={`board-note-line ${activeNote.selectedLines?.includes(index) ? "is-selected" : ""}`}
                          data-line={index}
                          key={index}
                        >
                          <span
                            className="board-note-line-number"
                            aria-hidden="true"
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="board-note-text">
                            {line || "\u200b"}
                            {"\n"}
                          </span>
                        </span>
                      ))}
                    </pre>
                  </article>
                  <div
                    className="board-note-resizer"
                    data-testid="board-note-resizer"
                    aria-hidden="true"
                    onPointerDown={(event) => {
                      noteResizeStart.current = {
                        y: event.clientY,
                        height: notePreviewHeight,
                      };
                      event.currentTarget.setPointerCapture(event.pointerId);
                    }}
                    onPointerMove={(event) => {
                      const start = noteResizeStart.current;
                      if (!start) return;
                      setNotePreviewHeight(
                        Math.max(316.8, start.height + event.clientY - start.y),
                      );
                    }}
                    onPointerUp={(event) => {
                      noteResizeStart.current = null;
                      event.currentTarget.releasePointerCapture(
                        event.pointerId,
                      );
                    }}
                    onPointerCancel={() => {
                      noteResizeStart.current = null;
                    }}
                  />
                </div>
              )}
            </section>
            <section className="board-detail-section board-collaboration">
              <h4>{t.boardCollaboration}</h4>
              <p className="board-join-hint">
                {selectedRole === "owner"
                  ? t.boardOwnerHint
                  : selectedRole === "member"
                    ? t.boardMemberHint
                    : t.boardJoinHint}
              </p>
              <div className="board-detail-actions">
                {selectedRole ? (
                  <button
                    ref={actionRef}
                    type="button"
                    className="board-primary board-access"
                    onClick={() => {
                      setAccessError(false);
                      setAccessConfirm(true);
                    }}
                  >
                    <span>{accessLabel}</span>
                    {selectedRole === "owner" ? (
                      <Unlink size={17} aria-hidden="true" />
                    ) : (
                      <LogOut size={17} aria-hidden="true" />
                    )}
                  </button>
                ) : (
                  <a
                    className="board-primary board-join"
                    href={selected.inviteUrl}
                  >
                    {t.boardJoin}
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                )}
                <button
                  type="button"
                  className="board-copy"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(selected.inviteUrl);
                      setCopied(true);
                    } catch {
                      setFailure(t.boardCopyError);
                    }
                  }}
                >
                  <span>{copied ? t.boardCopied : t.boardCopy}</span>
                  <Clipboard size={15} aria-hidden="true" />
                </button>
              </div>
            </section>
          </article>
        ) : (
          <>
            <SearchField
              value={query}
              onChange={setQuery}
              ariaLabel={t.boardSearch}
              placeholder={t.boardSearch}
            />
            {loading ? (
              <div
                className="board-skeleton"
                role="status"
                aria-label={t.boardLoading}
              >
                <span className="board-skeleton-label">{t.boardLoading}</span>
                <div aria-hidden="true">
                  {Array.from({ length: 5 }, (_, index) => (
                    <div className="board-skeleton-row" key={index}>
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                  ))}
                </div>
              </div>
            ) : error ? (
              <div className="board-empty" role="alert">
                <p>{t.boardLoadError}</p>
                <button type="button" onClick={reload}>
                  {t.boardRetry}
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="board-empty">
                <Layers size={32} aria-hidden="true" />
                <h3>{query.trim() ? t.boardNoResults : t.boardEmpty}</h3>
                <p>{t.boardEmptyHint}</p>
              </div>
            ) : (
              <div className="board-list board-table-container">
                <table className="board-table" aria-label={t.boardTitle}>
                  <thead>
                    <tr>
                      <th scope="col">{t.groupCategory}</th>
                      <th scope="col">{t.boardOwnerColumn}</th>
                      <th scope="col">{t.boardNotesColumn}</th>
                      <th scope="col">{t.boardMembersColumn}</th>
                      <th scope="col">{t.boardUpdatedColumn}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((post) => (
                      <tr
                        key={post.id}
                        data-group-id={post.id}
                        onClick={() => {
                          select(post.id);
                          setFailure("");
                          setCopied(false);
                        }}
                      >
                        <th scope="row">
                          <button
                            type="button"
                            className="board-entry"
                            data-group-id={post.id}
                          >
                            <strong>{post.title}</strong>
                          </button>
                        </th>
                        <td>
                          <span
                            className="board-owner"
                            title={post.ownerName || t.boardUnknownOwner}
                          >
                            <CircleUserRound size={16} aria-hidden="true" />
                            <span>{post.ownerName || t.boardUnknownOwner}</span>
                          </span>
                        </td>
                        <td>{post.noteCount}</td>
                        <td>{post.memberCount}</td>
                        <td>
                          <time
                            dateTime={new Date(post.updatedAt).toISOString()}
                          >
                            {new Date(post.updatedAt).toLocaleDateString(
                              language === "ko" ? "ko-KR" : "en-US",
                            )}
                          </time>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        {failure && (
          <p className="board-error" role="alert">
            {failure}
          </p>
        )}
        <span className="board-copy-status" role="status">
          {copied ? t.boardCopied : ""}
        </span>
      </div>
      {accessConfirm && selected && (
        <ConfirmPopup
          title={accessLabel}
          message={
            selectedRole === "owner"
              ? t.revokeGroupShareMessage
              : t.leaveGroupMessage
          }
          closeLabel={t.close}
          closeTitle={t.close}
          confirmLabel={accessLabel}
          confirmIcon={
            selectedRole === "owner" ? (
              <Unlink size={14} />
            ) : (
              <LogOut size={14} />
            )
          }
          keepOpenOnConfirm
          error={accessError ? t.groupAccessError : undefined}
          onCancel={() => {
            setAccessConfirm(false);
            actionRef.current?.focus();
          }}
          onConfirm={async () => {
            if (accessBusy.current || !sharing) return;
            accessBusy.current = true;
            setAccessError(false);
            try {
              if (
                await sharing.changeAccess(
                  selected.id,
                  selectedRole === "owner" ? "revoke" : "leave",
                )
              ) {
                setAccessConfirm(false);
                back();
                reload();
                contentRef.current
                  ?.querySelector<HTMLElement>("input, button")
                  ?.focus();
              } else setAccessError(true);
            } finally {
              accessBusy.current = false;
            }
          }}
        />
      )}
    </section>
  );
}
