import type { StateCreator } from "zustand";

import type { NotepadState } from "../../type";
import { createTabContentActions } from "./content-actions";
import { createTabLifecycleActions } from "./lifecycle-actions";
import { createTabNavigationActions } from "./navigation-actions";

type TabActions = Pick<
  NotepadState,
  | "addTab"
  | "selectTab"
  | "moveTab"
  | "moveTabs"
  | "updateTab"
  | "setTabSelectedLines"
  | "cycleTabColor"
  | "togglePin"
  | "setTabStatus"
  | "closeTab"
  | "archiveTab"
>;

export const createTabActions: StateCreator<
  NotepadState,
  [],
  [],
  TabActions
> = (set, get, store) => ({
  ...createTabNavigationActions(set, get, store),
  ...createTabContentActions(set, get, store),
  ...createTabLifecycleActions(set, get, store),
});
