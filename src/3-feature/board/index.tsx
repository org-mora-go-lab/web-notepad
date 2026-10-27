"use client";

import {
  ArrowUpRight,
  ChevronLeft,
  Clipboard,
  Layers,
  LogOut,
  NotebookPen,
  Unlink,
  Users,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";

import type { BoardPost } from "@/src/4-entity/notepad";
import { GroupSharingContext, useI18n } from "@/src/5-shared/hook";
import { ConfirmPopup, SearchField } from "@/src/5-shared/ui";

import { useBoard } from "./hook";

export function Board() {
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    contentRef.current?.querySelector<HTMLElement>("button, input")?.focus();
  }, []);
  const { t, language } = useI18n();
  const { posts, loading, error, reload } = useBoard();
  const sharing = useContext(GroupSharingContext);
  const [accessConfirm, setAccessConfirm] = useState(false);
  const [accessError, setAccessError] = useState(false);
  const accessBusy = useRef(false);
  const actionRef = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<BoardPost | null>(null);
  const [failure, setFailure] = useState("");
  const [copied, setCopied] = useState(false);
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
    setSelected(null);
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
              <a className="board-primary board-join" href={selected.inviteUrl}>
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
              <p className="board-empty" role="status">
                {t.boardLoading}
              </p>
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
                          setSelected(post);
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
                            <Layers size={16} aria-hidden="true" />
                            <strong>{post.title}</strong>
                            <ArrowUpRight size={16} aria-hidden="true" />
                          </button>
                        </th>
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
