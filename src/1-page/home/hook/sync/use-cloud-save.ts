"use client";

import { useEffect, useState } from "react";

import { createCloudSnapshot, useNotepadStore } from "@/src/4-entity/notepad";

export type CloudSaveStatus = "pending" | "saving" | "saved" | "error" | null;

type PendingUpdate = { eventId: string; snapshot: string };

const SAVE_DELAY_MS = 3_000;
const RETRY_DELAY_MS = 5_000;

export function useCloudSave(hydrated: boolean): CloudSaveStatus {
  const [status, setStatus] = useState<CloudSaveStatus>(null);

  useEffect(() => {
    if (!hydrated) return;

    let active = true;
    let userId: string | null = null;
    let pending: PendingUpdate | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let sending = false;
    let readyToSend = false;
    let changedBeforeAuth = false;
    let lastSnapshot = createCloudSnapshot(useNotepadStore.getState());

    const pendingKey = (id: string) => `web-notepad-cloud-pending:${id}`;
    const clearTimer = () => {
      if (timer) clearTimeout(timer);
      timer = undefined;
    };

    const flush = async () => {
      timer = undefined;
      if (!active || !userId || !pending) return;
      if (sending) {
        readyToSend = true;
        return;
      }
      sending = true;
      const update = pending;
      const savingUserId = userId;
      let failed = false;
      setStatus("saving");
      try {
        const response = await fetch("/api/notepad/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(update),
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Cloud save failed");
        if (active && userId === savingUserId && pending?.eventId === update.eventId) {
          pending = null;
          try { localStorage.removeItem(pendingKey(savingUserId)); } catch { /* localStorage may be unavailable */ }
          setStatus("saved");
        }
      } catch {
        failed = true;
        if (active && userId === savingUserId && pending?.eventId === update.eventId) {
          setStatus("error");
          timer = setTimeout(() => void flush(), RETRY_DELAY_MS);
        }
      } finally {
        sending = false;
        if (active && pending && readyToSend) {
          readyToSend = false;
          clearTimer();
          void flush();
        } else if (active && pending && timer && !failed) {
          setStatus("pending");
        }
      }
    };

    const queueSnapshot = (snapshot: string, restored?: PendingUpdate) => {
      if (!userId) {
        changedBeforeAuth = true;
        return;
      }
      pending = restored?.snapshot === snapshot
        ? restored
        : { eventId: crypto.randomUUID(), snapshot };
      try { localStorage.setItem(pendingKey(userId), JSON.stringify(pending)); } catch { /* localStorage may be unavailable */ }
      setStatus("pending");
      clearTimer();
      timer = setTimeout(() => void flush(), SAVE_DELAY_MS);
    };

    const unsubscribe = useNotepadStore.subscribe((state) => {
      const snapshot = createCloudSnapshot(state);
      if (snapshot === lastSnapshot) return;
      lastSnapshot = snapshot;
      queueSnapshot(snapshot);
    });

    const refreshSession = async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        if (!response.ok) return;
        const result = (await response.json()) as { user?: { id?: string } | null };
        if (!active) return;
        const nextUserId = result.user?.id ?? null;
        if (nextUserId === userId) return;
        clearTimer();
        pending = null;
        userId = nextUserId;
        setStatus(null);
        if (!userId) return;
        let restored: PendingUpdate | undefined;
        try {
          const value = localStorage.getItem(pendingKey(userId));
          if (value) {
            const candidate = JSON.parse(value) as PendingUpdate;
            if (typeof candidate.eventId === "string" && typeof candidate.snapshot === "string") restored = candidate;
          }
        } catch { /* Ignore a damaged local queue. */ }
        if (restored || changedBeforeAuth) {
          queueSnapshot(createCloudSnapshot(useNotepadStore.getState()), restored);
          changedBeforeAuth = false;
        }
      } catch {
        // Local editing remains available while session lookup is offline.
      }
    };

    window.addEventListener("notepad-auth-changed", refreshSession);
    void refreshSession();
    return () => {
      active = false;
      unsubscribe();
      clearTimer();
      window.removeEventListener("notepad-auth-changed", refreshSession);
    };
  }, [hydrated]);

  return status;
}
