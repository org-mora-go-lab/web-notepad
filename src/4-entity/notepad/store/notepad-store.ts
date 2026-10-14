import { create } from "zustand";
import { persist } from "zustand/middleware";

import { DEFAULT_SETTINGS, UNGROUPED_GROUP_ID } from "../constant";
import { normalizePersistedState } from "../persistence";
import type { NotepadState } from "../type";
import { createNoteTab } from "../util";
import { createBookmarkActions, createClosedTabActions } from "./archive";
import { createSettingActions } from "./setting-actions";
import { createTabActions } from "./tab";
import {
  createGroupActions,
  createGroupEntry,
  createPaneActions,
} from "./workspace";

export {
  ALL_GROUP_ID,
  ALL_GROUP_NAME,
  MAX_SPLIT_RATIO,
  MIN_SPLIT_RATIO,
  UNGROUPED_GROUP_ID,
} from "../constant";

export const useNotepadStore = create<NotepadState>()(
  persist(
    (set, get, store) => ({
      ...createTabActions(set, get, store),
      ...createPaneActions(set, get, store),
      ...createBookmarkActions(set, get, store),
      ...createGroupActions(set, get, store),
      ...createClosedTabActions(set, get, store),
      ...createSettingActions(set, get, store),
      nextTabNumber: 2,
      activeGroupId: UNGROUPED_GROUP_ID,
      groups: [
        createGroupEntry(UNGROUPED_GROUP_ID, "Ungrouped", 0, createNoteTab(1)),
      ],
      closedTabs: [],
      allGroupActiveTabId: null,
      allGroupLayout: null,
      settings: DEFAULT_SETTINGS,
    }),
    {
      name: "web-notepad-storage",
      skipHydration: true,
      merge: normalizePersistedState,
    },
  ),
);
