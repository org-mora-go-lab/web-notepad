path_helper: node.save: Permission denied
"use client";

import {
  ArrowUpRight,
  ChevronLeft,
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
import { ConfirmPopup, SearchField } from "@/src/5-shared/ui";

import { useBoard, useBoardSelection } from "./hook";

export function Board() {
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
        <div className="board-intro">
          <span className="board-eyebrow">
            <Layers size={14} aria-hidden="true" />
            {t.boardCommunity}
          </span>
          <p>{t.boardIntro}</p>
        </div>
        {selected && (
          <button type="button" className="board-back" onClick={back}>
            <ChevronLeft size={16} aria-hidden="true" />
            <span>{t.boardBack}</span>
          </button>
        )}
        {selected ? (
          <article className="board-detail">
            <span className="board-group-name">
              <Layers size={16} />
              {selected.groupName}
            </span>
            <span
              className="board-owner"
              aria-label={t.boardOwnerColumn}
              title={selected.ownerName || t.boardUnknownOwner}
            >
              <CircleUserRound size={16} aria-hidden="true" />
              <span>{selected.ownerName || t.boardUnknownOwner}</span>
            </span>
            <h3>{selected.title}</h3>
            <div className="board-meta">
              <span>
                <NotebookPen size={14} />
                {t.boardNotes(selected.noteCount)}
              </span>
              <span>
                <Users size={14} />
                {t.boardMembers(selected.memberCount)}
              </span>
            </div>
            <p className="board-description">{t.boardSharedWorkspace}</p>
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
                  <ArrowUpRight size={17} />
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
