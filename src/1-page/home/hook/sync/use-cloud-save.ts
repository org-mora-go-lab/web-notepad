"use client";

import { useEffect, useState } from "react";

import { createCloudSnapshot, DEFAULT_SETTINGS, getPaneLayout, type GroupEntry, isSharedGroupId, mergeCloudSnapshot, normalizePersistedState, UNGROUPED_GROUP_ID, useNotepadStore } from "@/src/4-entity/notepad";

export type CloudSaveStatus = "pending" | "saving" | "saved" | "error" | null;
type PendingUpdate = { eventId: string; snapshot: string; baseEventId?: string | null };
type Baseline = { eventId: string | null; snapshot: string | null };
type CloudRecord = { eventId: string; snapshot: string; createdAt: number };
const SAVE_DELAY_MS = 3_000;
const RETRY_DELAY_MS = 5_000;
const OWNER_KEY = "web-notepad-cloud-owner";

function readLocal<Value>(key: string): Value | null {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") as Value | null; }
  catch { return null; }
}
function writeLocal(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch { /* Local editing remains available without persistent storage. */ }
}
function hasLocalWork(snapshot: string) {
  const state = JSON.parse(snapshot);
  return state.closedTabs.length > 0 || Object.entries(DEFAULT_SETTINGS).some(([key, value]) => JSON.stringify(state.settings[key]) !== JSON.stringify(value))
    || state.groups.some((group: { id: string; bookmarks: unknown[]; tabs: { content: string }[] }) =>
      group.id !== UNGROUPED_GROUP_ID || group.bookmarks.length || group.tabs.length > 1 || group.tabs.some(tab => tab.content));
}

export function useCloudSave(hydrated: boolean): CloudSaveStatus {
  const [status, setStatus] = useState<CloudSaveStatus>(null);

  useEffect(() => {
    if (!hydrated) return;
    let active = true;
    let userId: string | null = null;
    let generation = 0;
    let sessionRequest = 0;
    let initialized = false;
    let applying = false;
    let pulling = false;
    let sending = false;
    let readyToSend = false;
    let changedBeforeAuth = false;
    let pending: PendingUpdate | null = null;
    let baseline: Baseline = { eventId: null, snapshot: null };
    let timer: ReturnType<typeof setTimeout> | undefined;
    let lastSnapshot = createCloudSnapshot(useNotepadStore.getState());
    const pendingKey = (id: string) => `web-notepad-cloud-pending:${id}`;
    const baseKey = (id: string) => `web-notepad-cloud-base:${id}`;
    const localKey = (id: string) => `web-notepad-cloud-local:${id}`;
    const valid = (id: string, version: number) => active && userId === id && generation === version;
    const clearTimer = () => { if (timer) clearTimeout(timer); timer = undefined; };
    const rememberBase = (latest: Baseline) => {
      baseline = latest;
      if (userId) writeLocal(baseKey(userId), baseline);
    };
    const apply = (snapshot: string, keepView: boolean, preserveShared = true) => {
      const current = useNotepadStore.getState();
      const source = JSON.parse(snapshot);
      if (!source || !Array.isArray(source.groups) || !Array.isArray(source.closedTabs) || !source.settings) {
        throw new Error("Invalid cloud snapshot");
      }
      // Shared groups have their own membership checks and revision protocol.
      source.groups = [
        ...source.groups.filter((group: { id: string }) => !isSharedGroupId(group.id)),
        ...(preserveShared ? current.groups.filter(group => isSharedGroupId(group.id)) : []),
      ];
      source.closedTabs = [
        ...source.closedTabs.filter((entry: { groupId: string }) => !isSharedGroupId(entry.groupId)),
        ...(preserveShared ? current.closedTabs.filter(entry => isSharedGroupId(entry.groupId)) : []),
      ];
      if (keepView || (preserveShared && isSharedGroupId(current.activeGroupId))) {
        source.activeGroupId = current.activeGroupId;
        source.allGroupLayout = current.allGroupLayout;
        source.allGroupActiveTabId = current.allGroupActiveTabId;
        source.groups = source.groups.map((group: GroupEntry) => {
          const existing = current.groups.find(item => item.id === group.id);
          return existing ? { ...group, ...getPaneLayout(existing) } : group;
        });
      }
      applying = true;
      try { useNotepadStore.setState(normalizePersistedState(source, current)); }
      finally { applying = false; }
      lastSnapshot = createCloudSnapshot(useNotepadStore.getState());
      if (userId) writeLocal(localKey(userId), lastSnapshot);
      window.dispatchEvent(new Event("notepad-cloud-applied"));
      return lastSnapshot;
    };
    const queue = (snapshot: string, restored?: PendingUpdate) => {
      if (!userId || !initialized) { changedBeforeAuth = true; return; }
      pending = restored?.snapshot === snapshot ? { ...restored, baseEventId: baseline.eventId }
        : { eventId: crypto.randomUUID(), snapshot, baseEventId: baseline.eventId };
      writeLocal(pendingKey(userId), pending);
      writeLocal(localKey(userId), snapshot);
      setStatus("pending");
      clearTimer();
      timer = setTimeout(() => void flush(), SAVE_DELAY_MS);
    };
    const reconcile = (latest: CloudRecord | null, first: boolean) => {
      const local = createCloudSnapshot(useNotepadStore.getState());
      let next = local;
      if (latest) {
        const dirty = !!pending || changedBeforeAuth || (baseline.snapshot !== null && local !== baseline.snapshot);
        next = dirty || (first && !baseline.snapshot && hasLocalWork(local))
          ? mergeCloudSnapshot(baseline.snapshot, local, latest.snapshot) : latest.snapshot;
      }
      const restored = pending ?? undefined;
      const needsSave = latest ? next !== latest.snapshot : !!restored || changedBeforeAuth || hasLocalWork(next);
      next = apply(next, !first);
      rememberBase({ eventId: latest?.eventId ?? null, snapshot: latest ? (needsSave ? latest.snapshot : next) : null });
      initialized = true;
      changedBeforeAuth = false;
      if (needsSave) queue(next, restored);
      else {
        clearTimer();
        pending = null;
        if (userId) writeLocal(pendingKey(userId), null);
        setStatus(latest ? "saved" : null);
      }
    };
    const pull = async () => {
      if (!userId || pulling || sending) return;
      const id = userId;
      const version = generation;
      pulling = true;
      try {
        const response = await fetch("/api/notepad/history", { cache: "no-store" });
        if (!response.ok) throw new Error("Cloud load failed");
        const { latest } = await response.json() as { latest: CloudRecord | null };
        if (!valid(id, version)) return;
        if (!initialized || (latest?.eventId ?? null) !== baseline.eventId) reconcile(latest, !initialized);
      } catch { if (valid(id, version) && !initialized) setStatus("error"); }
      finally { pulling = false; }
    };
    const flush = async () => {
      timer = undefined;
      if (!active || !userId || !pending || !initialized) return;
      if (sending) { readyToSend = true; return; }
      sending = true;
      const update = pending;
      const id = userId;
      const version = generation;
      setStatus("saving");
      try {
        const response = await fetch("/api/notepad/history", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...update, userId: id }), cache: "no-store",
        });
        if (!valid(id, version)) return;
        if (response.status === 409) {
          const { latest } = await response.json() as { latest: CloudRecord | null };
          if (valid(id, version)) reconcile(latest, false);
          return;
        }
        if (!response.ok) throw new Error("Cloud save failed");
        rememberBase({ eventId: update.eventId, snapshot: update.snapshot });
        if (pending?.eventId === update.eventId) {
          pending = null;
          writeLocal(pendingKey(id), null);
          setStatus("saved");
        } else if (pending) {
          pending.baseEventId = update.eventId;
          writeLocal(pendingKey(id), pending);
          setStatus("pending");
        }
      } catch {
        if (valid(id, version) && pending) {
          setStatus("error");
          clearTimer();
          timer = setTimeout(() => void flush(), RETRY_DELAY_MS);
        }
      } finally {
        sending = false;
        if (valid(id, version) && pending && readyToSend) {
          readyToSend = false;
          clearTimer();
          void flush();
        }
      }
    };
    const unsubscribe = useNotepadStore.subscribe(state => {
      const snapshot = createCloudSnapshot(state);
      if (applying || snapshot === lastSnapshot) return;
      lastSnapshot = snapshot;
      queue(snapshot);
    });
    const refreshSession = async () => {
      const requestId = ++sessionRequest;
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        if (!response.ok) return;
        const result = await response.json() as { user?: { id?: string } | null };
        if (!active || requestId !== sessionRequest) return;
        const nextId = result.user?.id ?? null;
        if (nextId === userId) return;
        generation += 1;
        clearTimer();
        pending = null;
        initialized = false;
        userId = nextId;
        setStatus(null);
        if (!userId) return;
        const previousOwner = readLocal<string>(OWNER_KEY);
        if (previousOwner && previousOwner !== userId) {
          apply(readLocal<string>(localKey(userId)) ?? createCloudSnapshot(useNotepadStore.getInitialState()), false, false);
          changedBeforeAuth = false;
        }
        writeLocal(OWNER_KEY, userId);
        baseline = readLocal<Baseline>(baseKey(userId)) ?? { eventId: null, snapshot: null };
        const restored = readLocal<PendingUpdate>(pendingKey(userId));
        if (restored && typeof restored.eventId === "string" && typeof restored.snapshot === "string") pending = restored;
        await pull();
      } catch { /* Local editing remains available while authentication is offline. */ }
    };
    const refresh = () => { if (document.visibilityState !== "hidden") void pull(); };
    window.addEventListener("notepad-auth-changed", refreshSession);
    window.addEventListener("focus", refresh);
    window.addEventListener("online", refresh);
    document.addEventListener("visibilitychange", refresh);
    const interval = setInterval(refresh, RETRY_DELAY_MS);
    void refreshSession();
    return () => {
      active = false;
      unsubscribe();
      clearTimer();
      clearInterval(interval);
      window.removeEventListener("notepad-auth-changed", refreshSession);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("online", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [hydrated]);

  return status;
}
