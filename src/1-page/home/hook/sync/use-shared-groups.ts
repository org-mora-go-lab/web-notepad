"use client";

import { useCallback, useEffect, useState } from "react";

import { applySharedGroupData, createJoinedGroup, isSharedGroupId, mergeSharedGroupData, type SharedGroupData, type SharedNotification, toSharedGroupData, UNGROUPED_GROUP_ID, useNotepadStore } from "@/src/4-entity/notepad";

type SharedRecord = { id: string; ownerId: string; revision: number; data: SharedGroupData; updatedAt: number };
export type ShareInviteStatus = "login" | "joining" | "joined" | "error" | null;
type PendingGroup = { base: SharedRecord; data: SharedGroupData };
const same = (left: unknown, right: unknown) => JSON.stringify(left) === JSON.stringify(right);

export function useSharedGroups(hydrated: boolean) {
  const [notifications, setNotifications] = useState<SharedNotification[]>([]);
  const [inviteStatus, setInviteStatus] = useState<ShareInviteStatus>(null);
  const [inviteToken] = useState<string | null>(() =>
    typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("share"),
  );

  useEffect(() => {
    if (!hydrated) return;
    let active = true;
    let userId: string | null = null;
    let sessionChecked = false;
    let refreshing = false;
    let refreshQueued = false;
    let applying = false;
    const baselines = new Map<string, SharedRecord>();
    const timers = new Map<string, ReturnType<typeof setTimeout>>();
    const sending = new Set<string>();
    const changedBeforeLoad = new Set<string>();
    const pendingKey = (id: string, groupId: string) => `web-notepad-shared-pending:${id}:${groupId}`;
    const share = inviteToken;

    const currentGroup = (id: string) => useNotepadStore.getState().groups.find((group) => group.id === id);
    const clearTimer = (id: string) => {
      const timer = timers.get(id);
      if (timer) clearTimeout(timer);
      timers.delete(id);
    };
    const applyData = (data: SharedGroupData) => {
      applying = true;
      try {
        useNotepadStore.setState((state) => {
          const current = state.groups.find((group) => group.id === data.id);
          return { groups: current
            ? state.groups.map((group) => group.id === data.id ? applySharedGroupData(group, data) : group)
            : [...state.groups, createJoinedGroup(data)] };
        });
      } finally { applying = false; }
    };
    const persistPending = (id: string, pending: PendingGroup | null) => {
      if (!userId) return;
      try {
        if (pending) localStorage.setItem(pendingKey(userId, id), JSON.stringify(pending));
        else localStorage.removeItem(pendingKey(userId, id));
      } catch { /* Local edits remain available. */ }
    };

    const flush = async (id: string) => {
      timers.delete(id);
      const base = baselines.get(id);
      const group = currentGroup(id);
      if (!active || !userId || !base || !group || sending.has(id)) return;
      const data = toSharedGroupData(group);
      if (same(data, base.data)) { persistPending(id, null); return; }
      sending.add(id);
      try {
        const response = await fetch("/api/groups/update", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, baseRevision: base.revision, data }),
        });
        if (response.status === 409) {
          const { group: remote } = await response.json() as { group: SharedRecord };
          if (!active) return;
          const latestLocal = currentGroup(id);
          const merged = mergeSharedGroupData(base.data, latestLocal ? toSharedGroupData(latestLocal) : data, remote.data);
          baselines.set(id, remote);
          applyData(merged);
          queue(id);
          return;
        }
        if (!response.ok) throw new Error("Shared group save failed");
        const { group: saved } = await response.json() as { group: SharedRecord };
        if (!active) return;
        baselines.set(id, saved);
        if (same(toSharedGroupData(currentGroup(id) ?? group), saved.data)) persistPending(id, null);
        else queue(id);
      } catch {
        if (active && userId) timers.set(id, setTimeout(() => void flush(id), 5_000));
      } finally { sending.delete(id); }
    };

    const queue = (id: string) => {
      const base = baselines.get(id);
      const group = currentGroup(id);
      if (!base || !group || !userId) return;
      const data = toSharedGroupData(group);
      if (same(data, base.data)) { persistPending(id, null); clearTimer(id); return; }
      persistPending(id, { base, data });
      clearTimer(id);
      timers.set(id, setTimeout(() => void flush(id), 3_000));
    };

    const refreshNotifications = async () => {
      if (!userId) return;
      try {
        const response = await fetch("/api/groups/notifications", { cache: "no-store" });
        if (!response.ok) return;
        const result = await response.json() as { notifications: SharedNotification[] };
        if (active) setNotifications(result.notifications);
      } catch { /* Retry when the screen returns or the connection recovers. */ }
    };

    const refreshGroups = async () => {
      if (!userId) return;
      if (refreshing) { refreshQueued = true; return; }
      refreshing = true;
      try {
        const response = await fetch("/api/groups", { cache: "no-store" });
        if (!response.ok) return;
        const result = await response.json() as { groups: SharedRecord[] };
        if (!active) return;
        const allowedIds = new Set(result.groups.map((record) => record.id));
        applying = true;
        try {
          useNotepadStore.setState((state) => ({
            groups: state.groups.filter((group) => !isSharedGroupId(group.id) || allowedIds.has(group.id)),
            activeGroupId: isSharedGroupId(state.activeGroupId) && !allowedIds.has(state.activeGroupId)
              ? UNGROUPED_GROUP_ID : state.activeGroupId,
          }));
        } finally { applying = false; }
        for (const remote of result.groups) {
          const base = baselines.get(remote.id);
          if (!base) {
            let pending: PendingGroup | null = null;
            try {
              const value = localStorage.getItem(pendingKey(userId, remote.id));
              if (value) pending = JSON.parse(value) as PendingGroup;
            } catch { /* Ignore damaged local queue data. */ }
            baselines.set(remote.id, pending?.base ?? remote);
            if (!currentGroup(remote.id)) applyData(pending?.data ?? remote.data);
            else if (!pending && !changedBeforeLoad.has(remote.id)) applyData(remote.data);
            if (pending || changedBeforeLoad.has(remote.id)) queue(remote.id);
            changedBeforeLoad.delete(remote.id);
          } else if (remote.revision > base.revision) {
            const local = currentGroup(remote.id);
            if (!local || same(toSharedGroupData(local), base.data)) {
              baselines.set(remote.id, remote);
              applyData(remote.data);
              persistPending(remote.id, null);
            }
          }
        }
        await refreshNotifications();
      } catch { /* Keep local editing available. */ }
      finally {
        refreshing = false;
        if (active && refreshQueued) { refreshQueued = false; void refreshGroups(); }
      }
    };

    const unsubscribe = useNotepadStore.subscribe((state) => {
      if (applying || !userId) return;
      for (const group of state.groups) {
        if (!isSharedGroupId(group.id)) continue;
        if (!baselines.has(group.id)) changedBeforeLoad.add(group.id);
        else queue(group.id);
      }
    });

    const joinInvite = async () => {
      if (!share || !userId) return;
      setInviteStatus("joining");
      try {
        const response = await fetch("/api/groups/join", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: share }),
        });
        if (!response.ok) throw new Error("Cannot join shared group");
        const { group } = await response.json() as { group: SharedRecord };
        if (!active) return;
        await refreshGroups();
        useNotepadStore.getState().selectGroup(group.id);
        const nextUrl = new URL(window.location.href);
        nextUrl.searchParams.delete("share");
        window.history.replaceState(window.history.state, "", nextUrl);
        setInviteStatus("joined");
      } catch { if (active) setInviteStatus("error"); }
    };

    const refreshSession = async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const result = await response.json() as { user?: { id?: string } | null };
        if (!active) return;
        const nextId = result.user?.id ?? null;
        if (sessionChecked && nextId === userId) return;
        sessionChecked = true;
        userId = nextId;
        baselines.clear();
        timers.forEach(clearTimeout);
        timers.clear();
        if (!userId) {
          setNotifications([]);
          if (share) setInviteStatus("login");
          applying = true;
          try { useNotepadStore.setState((state) => ({
            groups: state.groups.filter((group) => !isSharedGroupId(group.id)),
            activeGroupId: isSharedGroupId(state.activeGroupId) ? UNGROUPED_GROUP_ID : state.activeGroupId,
          })); } finally { applying = false; }
          return;
        }
        if (share) await joinInvite();
        else await refreshGroups();
      } catch { if (active && share) setInviteStatus("error"); }
    };

    const onShared = () => void refreshGroups();
    const onRestore = () => { if (document.visibilityState !== "hidden") void refreshGroups(); };
    window.addEventListener("shared-groups-changed", onShared);
    window.addEventListener("notepad-auth-changed", refreshSession);
    window.addEventListener("online", onRestore);
    window.addEventListener("focus", onRestore);
    document.addEventListener("visibilitychange", onRestore);
    void refreshSession();
    return () => {
      active = false;
      unsubscribe();
      timers.forEach(clearTimeout);
      window.removeEventListener("focus", onRestore);
      document.removeEventListener("visibilitychange", onRestore);
      window.removeEventListener("shared-groups-changed", onShared);
      window.removeEventListener("notepad-auth-changed", refreshSession);
      window.removeEventListener("online", onRestore);
    };
  }, [hydrated, inviteToken]);

  const markNotificationsRead = async () => {
    try {
      const response = await fetch("/api/groups/notifications/read", { method: "POST" });
      if (!response.ok) return;
      setNotifications((current) => current.map((item) => ({ ...item, unread: false })));
      const latest = await fetch("/api/groups/notifications", { cache: "no-store" });
      if (latest.ok) {
        const result = await latest.json() as { notifications: SharedNotification[] };
        setNotifications(result.notifications);
      }
    } catch { /* Keep the last loaded notifications available. */ }
  };
  const dismissInvite = useCallback(() => setInviteStatus(null), []);

  return {
    notifications,
    unreadCount: notifications.filter((notification) => notification.unread).length,
    inviteStatus,
    inviteToken,
    dismissInvite,
    markNotificationsRead,
  };
}
