"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { GroupSharingAccess } from "@/src/5-shared/type";

import { UNGROUPED_GROUP_ID } from "../../constant";
import { useNotepadStore } from "../../store";
import type { SharedGroupData, SharedNotification } from "../../type";
import {
  applySharedGroupData,
  createJoinedGroup,
  isSharedGroupId,
  mergeSharedGroupData,
  toSharedGroupData,
} from "../../util";

type SharedRecord = {
  id: string;
  ownerId: string;
  revision: number;
  data: SharedGroupData;
  updatedAt: number;
  sharingActive?: boolean;
};
export type ShareInviteStatus = "login" | "joining" | "joined" | "error" | null;
type PendingGroup = { base: SharedRecord; data: SharedGroupData };
const same = (left: unknown, right: unknown) =>
  JSON.stringify(left) === JSON.stringify(right);

export function useSharedGroups(hydrated: boolean) {
  const groups = useNotepadStore((state) => state.groups);
  const [loading, setLoading] = useState(true);
  const [groupsLoaded, setGroupsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [checkingGroups, setCheckingGroups] = useState(false);
  const notificationsRefreshRef = useRef<(() => Promise<void>) | null>(null);
  const refreshRef = useRef<(() => Promise<void>) | null>(null);
  const [savingTabIds, setSavingTabIds] = useState<string[]>([]);
  const [accessByGroup, setAccessByGroup] = useState<
    Record<string, GroupSharingAccess>
  >({});
  const [deletedTabIds, setDeletedTabIds] = useState(new Set<string>());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<SharedNotification[]>([]);
  const [inviteStatus, setInviteStatus] = useState<ShareInviteStatus>(null);
  const [inviteToken] = useState<string | null>(() =>
    typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get("share"),
  );

  useEffect(() => {
    if (!hydrated) return;
    let active = true;
    let userId: string | null = null;
    let sessionChecked = false;
    let refreshing = false;
    let refreshQueued = false;
    const refreshWaiters: Array<() => void> = [];
    let applying = false;
    const baselines = new Map<string, SharedRecord>();
    const timers = new Map<string, ReturnType<typeof setTimeout>>();
    const sending = new Set<string>();
    const editedContents = new Map<string, string>();
    const changedBeforeLoad = new Set<string>();
    const pendingKey = (id: string, groupId: string) =>
      `web-notepad-shared-pending:${id}:${groupId}`;
    const share = inviteToken;

    const currentGroup = (id: string) =>
      useNotepadStore.getState().groups.find((group) => group.id === id);
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
          return {
            groups: current
              ? state.groups.map((group) =>
                  group.id === data.id
                    ? applySharedGroupData(group, data)
                    : group,
                )
              : [...state.groups, createJoinedGroup(data)],
          };
        });
      } finally {
        applying = false;
      }
    };
    const persistPending = (id: string, pending: PendingGroup | null) => {
      if (!userId) return;
      try {
        if (pending)
          localStorage.setItem(pendingKey(userId, id), JSON.stringify(pending));
        else localStorage.removeItem(pendingKey(userId, id));
      } catch {
        /* Local edits remain available. */
      }
    };

    const flush = async (id: string) => {
      timers.delete(id);
      const base = baselines.get(id);
      const group = currentGroup(id);
      if (!active || !userId || !base || !group || sending.has(id)) return;
      const data = toSharedGroupData(group);
      if (same(data, base.data)) {
        persistPending(id, null);
        return;
      }
      sending.add(id);
      const sentContents = new Map(
        data.tabs
          .filter((tab) => editedContents.get(tab.id) === tab.content)
          .map((tab) => [tab.id, tab.content]),
      );
      setSavingTabIds((current) => [
        ...new Set([...current, ...sentContents.keys()]),
      ]);
      try {
        const response = await fetch("/api/groups/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, baseRevision: base.revision, data }),
        });
        if (response.status === 409) {
          const { group: remote } = (await response.json()) as {
            group: SharedRecord;
          };
          if (!active) return;
          const latestLocal = currentGroup(id);
          const merged = mergeSharedGroupData(
            base.data,
            latestLocal ? toSharedGroupData(latestLocal) : data,
            remote.data,
          );
          baselines.set(id, remote);
          applyData(merged);
          queue(id);
          return;
        }
        if (!response.ok) throw new Error("Shared group save failed");
        const { group: saved } = (await response.json()) as {
          group: SharedRecord;
        };
        if (!active) return;
        baselines.set(id, saved);
        for (const [tabId, content] of sentContents)
          if (editedContents.get(tabId) === content)
            editedContents.delete(tabId);
        if (same(toSharedGroupData(currentGroup(id) ?? group), saved.data))
          persistPending(id, null);
        else queue(id);
      } catch {
        if (active && userId)
          timers.set(
            id,
            setTimeout(() => void flush(id), 5_000),
          );
      } finally {
        sending.delete(id);
        if (active)
          setSavingTabIds((current) =>
            current.filter((tabId) => !sentContents.has(tabId)),
          );
      }
    };

    const queue = (id: string) => {
      const base = baselines.get(id);
      const group = currentGroup(id);
      if (!base || !group || !userId) return;
      const data = toSharedGroupData(group);
      if (same(data, base.data)) {
        persistPending(id, null);
        clearTimer(id);
        return;
      }
      persistPending(id, { base, data });
      clearTimer(id);
      timers.set(
        id,
        setTimeout(() => void flush(id), 500),
      );
    };

    const refreshNotifications = async () => {
      if (!userId) return;
      try {
        const response = await fetch("/api/groups/notifications", {
          cache: "no-store",
        });
        if (!response.ok) return;
        const result = (await response.json()) as {
          notifications: SharedNotification[];
        };
        if (active) setNotifications(result.notifications);
      } catch {
        /* Retry when the screen returns or the connection recovers. */
      }
    };

    const refreshGroups = async (): Promise<void> => {
      if (!userId) return;
      if (refreshing) {
        refreshQueued = true;
        return new Promise<void>((resolve) => refreshWaiters.push(resolve));
      }
      refreshing = true;
      setCheckingGroups(true);
      setLoadError(false);
      try {
        const response = await fetch("/api/groups", { cache: "no-store" });
        if (!response.ok) throw Error("Groups unavailable");
        const result = (await response.json()) as { groups: SharedRecord[] };
        if (!active) return;
        const allowedIds = new Set(result.groups.map((record) => record.id));
        setAccessByGroup(
          Object.fromEntries(
            result.groups.map((record) => [
              record.id,
              {
                role: record.ownerId === userId ? "owner" : "member",
                active: record.sharingActive !== false,
              },
            ]),
          ),
        );
        for (const id of baselines.keys()) {
          if (allowedIds.has(id)) continue;
          clearTimer(id);
          persistPending(id, null);
          baselines.delete(id);
          changedBeforeLoad.delete(id);
        }
        applying = true;
        try {
          useNotepadStore.setState((state) => ({
            groups: state.groups.filter(
              (group) => !isSharedGroupId(group.id) || allowedIds.has(group.id),
            ),
            activeGroupId:
              isSharedGroupId(state.activeGroupId) &&
              !allowedIds.has(state.activeGroupId)
                ? UNGROUPED_GROUP_ID
                : state.activeGroupId,
          }));
        } finally {
          applying = false;
        }
        for (const remote of result.groups) {
          const base = baselines.get(remote.id);
          if (!base) {
            let pending: PendingGroup | null = null;
            try {
              const value = localStorage.getItem(pendingKey(userId, remote.id));
              if (value) pending = JSON.parse(value) as PendingGroup;
            } catch {
              /* Ignore damaged local queue data. */
            }
            baselines.set(remote.id, pending?.base ?? remote);
            if (!currentGroup(remote.id))
              applyData(pending?.data ?? remote.data);
            else if (!pending && !changedBeforeLoad.has(remote.id))
              applyData(remote.data);
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
        if (active) setGroupsLoaded(true);
      } catch {
        if (active) setLoadError(true);
      } finally {
        refreshing = false;
        if (active) setLoading(false);
        if (active && userId && refreshQueued) {
          refreshQueued = false;
          await refreshGroups();
        } else {
          refreshQueued = false;
          if (active) setCheckingGroups(false);
          refreshWaiters.splice(0).forEach((resolve) => resolve());
        }
      }
    };

    const unsubscribe = useNotepadStore.subscribe((state, previous) => {
      if (!userId) return;
      const presentIds = new Set(
        state.groups
          .filter((group) => isSharedGroupId(group.id))
          .flatMap((group) => group.tabs.map((tab) => tab.id)),
      );
      setDeletedTabIds((current) => {
        const next = new Set(current);
        for (const group of previous.groups.filter((group) =>
          isSharedGroupId(group.id),
        )) {
          for (const tab of group.tabs)
            if (!presentIds.has(tab.id)) next.add(tab.id);
        }
        for (const id of presentIds) next.delete(id);
        return next.size === current.size &&
          [...next].every((id) => current.has(id))
          ? current
          : next;
      });
      if (applying) return;
      const previousContents = new Map(
        previous.groups
          .filter((group) => isSharedGroupId(group.id))
          .flatMap((group) =>
            group.tabs.map((tab) => [tab.id, tab.content] as const),
          ),
      );
      const changedIds: string[] = [];
      for (const group of state.groups.filter((group) =>
        isSharedGroupId(group.id),
      )) {
        for (const tab of group.tabs) {
          if (
            previousContents.has(tab.id) &&
            previousContents.get(tab.id) !== tab.content
          ) {
            editedContents.set(tab.id, tab.content);
            changedIds.push(tab.id);
          }
        }
      }
      if (changedIds.length)
        setSavingTabIds((current) =>
          current.filter((id) => !changedIds.includes(id)),
        );
      for (const group of state.groups) {
        if (!isSharedGroupId(group.id)) continue;
        const previousGroup = previous.groups.find(
          (item) => item.id === group.id,
        );
        if (
          previousGroup &&
          same(toSharedGroupData(previousGroup), toSharedGroupData(group))
        )
          continue;
        if (!baselines.has(group.id)) changedBeforeLoad.add(group.id);
        else queue(group.id);
      }
    });

    const joinInvite = async () => {
      if (!share || !userId) return;
      setInviteStatus("joining");
      try {
        const response = await fetch("/api/groups/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: share }),
        });
        if (!response.ok) throw new Error("Cannot join shared group");
        const { group } = (await response.json()) as { group: SharedRecord };
        if (!active) return;
        await refreshGroups();
        useNotepadStore.getState().selectGroup(group.id);
        const nextUrl = new URL(window.location.href);
        nextUrl.searchParams.delete("share");
        window.history.replaceState(window.history.state, "", nextUrl);
        setInviteStatus("joined");
      } catch {
        if (active) setInviteStatus("error");
      }
    };

    const refreshSession = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
        });
        if (!response.ok) throw Error("Session unavailable");
        const result = (await response.json()) as {
          user?: { id?: string } | null;
        };
        if (!active) return;
        const nextId = result.user?.id ?? null;
        if (sessionChecked && nextId === userId) {
          if (userId) await refreshGroups();
          return;
        }
        sessionChecked = true;
        userId = nextId;
        setCurrentUserId(nextId);
        setDeletedTabIds(new Set());
        setNotifications([]);
        setGroupsLoaded(false);
        setLoadError(false);
        baselines.clear();
        editedContents.clear();
        setSavingTabIds([]);
        timers.forEach(clearTimeout);
        timers.clear();
        if (!userId) {
          setGroupsLoaded(true);
          setNotifications([]);
          setLoading(false);
          setAccessByGroup({});
          if (share) setInviteStatus("login");
          applying = true;
          try {
            useNotepadStore.setState((state) => ({
              groups: state.groups.filter(
                (group) => !isSharedGroupId(group.id),
              ),
              activeGroupId: isSharedGroupId(state.activeGroupId)
                ? UNGROUPED_GROUP_ID
                : state.activeGroupId,
            }));
          } finally {
            applying = false;
          }
          return;
        }
        if (share) await joinInvite();
        else await refreshGroups();
      } catch {
        if (active) {
          setLoading(false);
          setLoadError(true);
          if (share) setInviteStatus("error");
        }
      }
    };

    refreshRef.current = refreshGroups;
    notificationsRefreshRef.current = refreshNotifications;
    const onShared = () => void refreshGroups();
    const onRestore = () => {
      if (document.visibilityState !== "hidden") void refreshGroups();
    };
    window.addEventListener("shared-groups-changed", onShared);
    window.addEventListener("notepad-auth-changed", refreshSession);
    window.addEventListener("online", onRestore);
    window.addEventListener("focus", onRestore);
    document.addEventListener("visibilitychange", onRestore);
    void refreshSession();
    return () => {
      active = false;
      refreshRef.current = null;
      notificationsRefreshRef.current = null;
      unsubscribe();
      timers.forEach(clearTimeout);
      window.removeEventListener("focus", onRestore);
      document.removeEventListener("visibilitychange", onRestore);
      window.removeEventListener("shared-groups-changed", onShared);
      window.removeEventListener("notepad-auth-changed", refreshSession);
      window.removeEventListener("online", onRestore);
    };
  }, [hydrated, inviteToken]);

  const changeAccess = async (id: string, action: "leave" | "revoke") => {
    try {
      const response = await fetch("/api/groups/" + action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) return false;
      window.dispatchEvent(new Event("shared-groups-changed"));
      return true;
    } catch {
      return false;
    }
  };

  const markNotificationsRead = async (id: number) => {
    try {
      const response = await fetch("/api/groups/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) return;
      setNotifications((current) =>
        current.map((item) =>
          item.id === id ? { ...item, unread: false } : item,
        ),
      );
      const latest = await fetch("/api/groups/notifications", {
        cache: "no-store",
      });
      if (latest.ok) {
        const result = (await latest.json()) as {
          notifications: SharedNotification[];
        };
        setNotifications(result.notifications);
      }
    } catch {
      /* Keep the last loaded notifications available. */
    }
  };
  const clearNotifications = async () => {
    try {
      const response = await fetch("/api/groups/notifications", {
        method: "DELETE",
      });
      if (!response.ok) return false;
      const latest = await fetch("/api/groups/notifications", {
        cache: "no-store",
      });
      if (latest.ok) {
        const result = (await latest.json()) as {
          notifications: SharedNotification[];
        };
        setNotifications(result.notifications);
      } else setNotifications([]);
      return true;
    } catch {
      return false;
    }
  };
  const dismissInvite = useCallback(() => setInviteStatus(null), []);

  const visibleNotifications = notifications.filter((notification) => {
    const group = groups.find((group) => group.id === notification.groupId);
    const tab = group?.tabs.find((tab) => tab.id === notification.tabId);
    if (notification.actorId === currentUserId) return false;
    if (tab) return true;
    return (
      !!notification.tabId &&
      !deletedTabIds.has(notification.tabId) &&
      (loading || checkingGroups)
    );
  });

  return {
    notifications: visibleNotifications,
    loading,
    checkingGroups,
    groupsLoaded,
    loadError,
    refreshGroups: () => refreshRef.current?.(),
    refreshNotifications: () => notificationsRefreshRef.current?.(),
    savingTabIds,
    accessByGroup,
    changeAccess,
    unreadCount: visibleNotifications.filter(
      (notification) => notification.unread,
    ).length,
    inviteStatus,
    inviteToken,
    dismissInvite,
    markNotificationsRead,
    clearNotifications,
  };
}
