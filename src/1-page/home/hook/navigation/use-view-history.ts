"use client";

import { useCallback, useEffect, useRef } from "react";

import type { ViewSnapshot } from "../../type";
import {
  getViewHref,
  makeHistoryState,
  readStoredView,
  readViewFromUrl,
} from "../../util";

export function useViewHistory(
  ready: boolean,
  initialSnapshot: ViewSnapshot,
  onRestore: (snapshot: ViewSnapshot) => void,
) {
  const initialized = useRef(false);
  const snapshotRef = useRef(initialSnapshot);
  const initialSnapshotRef = useRef(initialSnapshot);
  const restoreRef = useRef(onRestore);

  useEffect(() => {
    initialSnapshotRef.current = initialSnapshot;
    restoreRef.current = onRestore;
  }, [initialSnapshot, onRestore]);

  useEffect(() => {
    if (!ready || initialized.current) return;
    const storedView = readStoredView(window.history.state);
    const initialView =
      readViewFromUrl() ?? storedView?.snapshot ?? initialSnapshotRef.current;
    const snapshot = {
      ...initialView,
      groupMenuOpen: initialView.groupMenuOpen ?? storedView?.snapshot.groupMenuOpen ?? initialSnapshotRef.current.groupMenuOpen,
    };
    snapshotRef.current = snapshot;
    restoreRef.current(snapshot);
    window.history.replaceState(
      makeHistoryState(snapshot),
      "",
      window.location.href,
    );
    initialized.current = true;
  }, [ready]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const snapshot =
        readStoredView(event.state)?.snapshot ?? readViewFromUrl();
      if (!snapshot) return;
      snapshotRef.current = snapshot;
      restoreRef.current(snapshot);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const pushView = useCallback((snapshot: ViewSnapshot) => {
    if (!initialized.current) return;
    if (JSON.stringify(snapshotRef.current) === JSON.stringify(snapshot))
      return;
    window.history.pushState(
      makeHistoryState(snapshot),
      "",
      getViewHref(snapshot),
    );
    snapshotRef.current = snapshot;
  }, []);

  const replaceView = useCallback((snapshot: ViewSnapshot) => {
    if (!initialized.current) return;
    window.history.replaceState(
      makeHistoryState(snapshot),
      "",
      getViewHref(snapshot),
    );
    snapshotRef.current = snapshot;
  }, []);

  return { pushView, replaceView };
}
