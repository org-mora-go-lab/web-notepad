"use client";

import {
  ArrowUpRight,
  ChevronLeft,
  Clipboard,
  Layers,
  NotebookPen,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import type { BoardPost } from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";
import { SearchField, SidePanel } from "@/src/5-shared/ui";

import { useBoard } from "./hook";
import type { BoardProps } from "./type";

export function Board({ onClose }: BoardProps) {
  const formId = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    contentRef.current?.querySelector<HTMLElement>("button, input")?.focus();
  }, []);
  const { t, language } = useI18n();
  const { posts, loading, error, reload } = useBoard();
  const [admin] = useState(
    () => new URLSearchParams(window.location.search).get("role") === "admin",
  );
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<BoardPost | null>(null);
  const [editing, setEditing] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  const [copied, setCopied] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const filtered = posts.filter((post) =>
    `${post.title} ${post.description} ${post.groupName}`
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase()),
  );

  const startEdit = (post: BoardPost | null) => {
    setSelected(post);
    setTitle(post?.title ?? "");
    setDescription(post?.description ?? "");
    setInviteUrl("");
    setFailure("");
    setRemoving(false);
    setEditing(true);
  };
  const back = () => {
    setSelected(null);
    setEditing(false);
    setRemoving(false);
    setFailure("");
    setCopied(false);
  };
  const save = async (method: "POST" | "PATCH" | "DELETE") => {
    if (busy) return;
    setBusy(true);
    setFailure("");
    try {
      const response = await fetch("/api/board?role=admin", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selected?.id,
          title,
          description,
          inviteUrl,
        }),
      });
      if (!response.ok) {
        setFailure(
          response.status === 409
            ? t.boardDuplicate
            : response.status === 400 || response.status === 404
              ? t.boardInvalid
              : t.boardSaveError,
        );
        return;
      }
      back();
      reload();
    } catch {
      setFailure(t.boardSaveError);
    } finally {
      setBusy(false);
    }
  };

  return (
    <SidePanel
      className="board"
      id="board-panel"
      title={t.boardTitle}
      ariaLabel={t.boardTitle}
      closeLabel={t.closePanel(t.boardTitle)}
      open
      onClose={onClose}
    >
      <div className="board-content" ref={contentRef} aria-busy={loading || busy}
        onKeyDown={(event) => {
          if (event.key !== "Escape" && (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)) event.stopPropagation();
        }}>
        <div className="board-intro">
          <span className="board-eyebrow">
            <Layers size={14} aria-hidden="true" />
            {t.boardCommunity}
          </span>
          <p>{t.boardIntro}</p>
          {admin && <span className="board-admin-badge">{t.boardAdmin}</span>}
        </div>
        {admin && !selected && !editing && (
          <button
            type="button"
            className="board-primary board-publish"
            onClick={() => startEdit(null)}
          >
            <Plus size={16} />
            {t.boardPublish}
          </button>
        )}
        {(selected || editing) && (
          <button
            type="button"
            className="board-back"
            onClick={back}
            disabled={busy}
          >
            <ChevronLeft size={16} />
            {t.boardBack}
          </button>
        )}
        {editing ? (
          <form
            className="board-form"
            onSubmit={(event) => {
              event.preventDefault();
              void save(selected ? "PATCH" : "POST");
            }}
          >
            <h3>{selected ? t.boardEdit : t.boardPublish}</h3>
            {!selected && (
              <div className="board-field">
                <label htmlFor={`${formId}-invite`}>{t.boardInviteLink}</label>
                <input
                  id={`${formId}-invite`}
                  aria-describedby={`${formId}-help`}
                  type="url"
                  required
                  maxLength={2000}
                  value={inviteUrl}
                  onChange={(event) => setInviteUrl(event.target.value)}
                  placeholder="https://…/?share=…"
                />
                <small id={`${formId}-help`}>{t.boardLinkHelp}</small>
              </div>
            )}
            <div className="board-field">
              <label htmlFor={`${formId}-title`}>{t.boardPostTitle}</label>
              <input
                id={`${formId}-title`}
                required
                maxLength={80}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div className="board-field">
              <label htmlFor={`${formId}-description`}>{t.boardDescription}</label>
              <textarea
                id={`${formId}-description`}
                required
                maxLength={1000}
                rows={6}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <div className="board-actions">
              <button type="button" onClick={back} disabled={busy}>
                {t.cancel}
              </button>
              <button
                className="board-primary"
                type="submit"
                disabled={
                  busy ||
                  !title.trim() ||
                  !description.trim() ||
                  (!selected && !inviteUrl.trim())
                }
              >
                {busy ? t.boardSaving : t.boardSave}
              </button>
            </div>
          </form>
        ) : selected ? (
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
            <p className="board-description">{selected.description}</p>
            <p className="board-join-hint">{t.boardJoinHint}</p>
            <a className="board-primary board-join" href={selected.inviteUrl}>
              {t.boardJoin}
              <ArrowUpRight size={17} />
            </a>
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
              <Clipboard size={15} />
              {copied ? t.boardCopied : t.boardCopy}
            </button>
            {admin && (
              <div className="board-admin-actions">
                <button type="button" onClick={() => startEdit(selected)}>
                  <Pencil size={15} />
                  {t.boardEdit}
                </button>
                <button type="button" onClick={() => setRemoving(true)}>
                  <Trash2 size={15} />
                  {t.boardRemove}
                </button>
              </div>
            )}
            {removing && (
              <div
                className="board-remove-confirm"
                role="group"
                aria-label={t.boardRemove}
              >
                <p>{t.boardRemoveHint}</p>
                <div className="board-actions">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setRemoving(false)}
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void save("DELETE")}
                  >
                    {t.boardRemove}
                  </button>
                </div>
              </div>
            )}
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
              <div className="board-list">
                {filtered.map((post) => (
                  <button
                    type="button"
                    className="board-card"
                    key={post.id}
                    onClick={() => {
                      setSelected(post);
                      setFailure("");
                      setCopied(false);
                    }}
                  >
                    <span className="board-card-top">
                      <span className="board-group-name">
                        <Layers size={14} />
                        {post.groupName}
                      </span>
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </span>
                    <strong>{post.title}</strong>
                    <p>{post.description}</p>
                    <span className="board-meta">
                      <span>
                        <NotebookPen size={13} />
                        {t.boardNotes(post.noteCount)}
                      </span>
                      <span>
                        <Users size={13} />
                        {t.boardMembers(post.memberCount)}
                      </span>
                      <time dateTime={new Date(post.updatedAt).toISOString()}>
                        {new Date(post.updatedAt).toLocaleDateString(
                          language === "ko" ? "ko-KR" : "en-US",
                        )}
                      </time>
                    </span>
                  </button>
                ))}
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
    </SidePanel>
  );
}
