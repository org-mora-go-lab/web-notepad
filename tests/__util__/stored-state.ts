import { randomUUID } from "node:crypto";

import type { Page } from "@playwright/test";

import type { GroupEntry, NotepadState } from "@/src/4-entity/notepad";

import { STORAGE_KEY } from "../__constant__";

export type StoredState = Pick<
  NotepadState,
  "groups" | "activeGroupId" | "nextTabNumber"
> &
  Partial<Pick<NotepadState, "closedTabs" | "settings">>;

// Reads the persisted Zustand state from localStorage.
export const readStoredState = (page: Page): Promise<StoredState> =>
  page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!).state,
    STORAGE_KEY,
  );

export const readActiveGroup = async (page: Page): Promise<GroupEntry> => {
  const state = await readStoredState(page);
  return state.groups.find((group) => group.id === state.activeGroupId)!;
};

// Seeds a document before the app hydrates. A session marker keeps reloads from resetting edits.
async function seedStoredState(page: Page, state: unknown, onceKey?: string) {
  await page.addInitScript(
    ({ key, value, onceKey }) => {
      if (onceKey && sessionStorage.getItem(onceKey)) return;
      localStorage.setItem(key, JSON.stringify({ state: value, version: 0 }));
      if (onceKey) sessionStorage.setItem(onceKey, "true");
    },
    { key: STORAGE_KEY, value: state, onceKey },
  );
  await page.goto("/");
}

export function seedStoredStateOnce(
  page: Page,
  state: unknown,
  onceKey = `e2e-state-${randomUUID()}`,
) {
  return seedStoredState(page, state, onceKey);
}

// Each call replaces the state once; subsequent reloads keep the app's changes.
export function writeStoredState(page: Page, state: unknown) {
  return seedStoredStateOnce(page, state);
}

// Seeds before every page load, including reloads, for restoration scenarios.
export function seedStoredStateOnLoad(page: Page, state: unknown) {
  return seedStoredState(page, state);
}
