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
import { useContext, useEffect, useRef, useState } from "react";

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
  const orderedNotes = selected
    ? [...selected.notes].sort(
        (left, right) => Number(right.bookmarked) - Number(left.bookmarked),
      )
    : [];
  const activeNote =
    orderedNotes.find((note) => note.id === activeNoteId) ?? orderedNotes[0];
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
        className="board-page-header"
        onBack={selected ? back : undefined}
        onNavigateBack={onReturnHome}
        title={t.boardTitle}
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
            <header className="board-detail-hero">
              <div className="board-detail-summary">
                <div className="board-detail-context">
                  <span className="board-group-name">
                    <Layers size={16} aria-hidden="true" />
                    {selected.groupName}
                  </span>
                  <span className="board-role">
                    {selectedRole === "owner"
                      ? t.boardOwnerRole
                      : selectedRole === "member"
                        ? t.boardMemberRole
                        : t.boardGuestRole}
                  </span>
                </div>
                <h3>{selected.title}</h3>
                <span
                  className="board-owner"
                  aria-label={t.boardOwnerColumn}
                  title={selected.ownerName || t.boardUnknownOwner}
                >
                  <CircleUserRound size={16} aria-hidden="true" />
                  <span>{selected.ownerName || t.boardUnknownOwner}</span>
                </span>
                <p className="board-description">{t.boardSharedWorkspace}</p>
              </div>
              <section
                className="board-overview"
                aria-labelledby="board-overview-title"
              >
                <h4 id="board-overview-title">{t.boardOverview}</h4>
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
                      <time
                        dateTime={new Date(selected.updatedAt).toISOString()}
                      >
                        {new Date(selected.updatedAt).toLocaleDateString(
                          language === "ko" ? "ko-KR" : "en-US",
                        )}
                      </time>
                    </strong>
                  </span>
                </div>
              </section>
            </header>
            <section className="board-detail-section board-note-contents">
              <h4>{t.boardNoteContents}</h4>
              <div
                className="board-note-tabs"
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
                <article
                  className="board-note-preview"
                  id="board-active-note"
                  role="tabpanel"
                >
                  <pre>
                    {(activeNote.content.trim() || t.emptyNote)
                      .split("\n")
                      .map((line, index) => (
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
