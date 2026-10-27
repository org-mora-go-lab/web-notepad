import type { StateCreator } from "zustand";

import type { NotepadState } from "../../type";
import {
  getTabStatus,
  getTitleFromContent,
  sanitizeSelectedLines,
} from "../../util";
import { getTabGroup, patchTabAndBookmark, updateGroup } from "../workspace";

type Actions = Pick<
  NotepadState,
  "updateTab" | "setTabSelectedLines" | "cycleTabColor"
>;

export const createTabContentActions: StateCreator<
  NotepadState,
  [],
  [],
  Actions
> = (set) => ({
  updateTab: (tabId, content) =>
    set((state) => {
      const group = getTabGroup(state, tabId);
      const tab = group?.tabs.find((item) => item.id === tabId);
      if (!group || !tab) return state;

      const nextContent = typeof content === "string" ? content : "";
      const nextTitle = getTitleFromContent(nextContent, tab.title);
      return updateGroup(state, group.id, (current) =>
        patchTabAndBookmark(
          current,
          tabId,
          { title: nextTitle, content: nextContent, updatedAt: Date.now() },
          { title: nextTitle, content: nextContent, updatedAt: Date.now() },
        ),
      );
    }),
  setTabSelectedLines: (tabId, selectedLines) =>
    set((state) => {
      const group = getTabGroup(state, tabId);
      const tab = group?.tabs.find((item) => item.id === tabId);
      if (!group || !tab) return state;
      const nextLines = sanitizeSelectedLines(selectedLines, tab.content);
      if (
        nextLines.length === tab.selectedLines.length &&
        nextLines.every((line, index) => line === tab.selectedLines[index])
      )
        return state;
      return updateGroup(state, group.id, (current) =>
        patchTabAndBookmark(
          current,
          tabId,
          { selectedLines: nextLines },
          { selectedLines: [...nextLines], updatedAt: Date.now() },
        ),
      );
    }),
  cycleTabColor: (tabId) =>
    set((state) => {
      const group = getTabGroup(state, tabId);
      const tab = group?.tabs.find((item) => item.id === tabId);
      if (!group || !tab) return state;
      const cycle = state.settings.tabColorCycle;
      const statuses = ["todo", "ready", "in-progress"] as const;
      const index = statuses.findIndex(
        (status) => status === getTabStatus(tab, cycle),
      );
      const next = (index + 1) % statuses.length;
      const nextColor = cycle[next];
      return updateGroup(state, group.id, (current) =>
        patchTabAndBookmark(
          current,
          tabId,
          {
            tabColor: nextColor,
            dashboardStatus: statuses[next],
            dashboardOrder: undefined,
          },
          { tabColor: nextColor, updatedAt: Date.now() },
        ),
      );
    }),
});
