import type { GroupEntry, NoteTab, PaneId } from "../type";
import { getPaneActiveTabId, getPaneOfTab, PANE_IDS } from "./pane-layout";

// Derive all pane contents in one pass; view modules do not need to rebuild domain layout state.
export function getPaneWorkspace(group: GroupEntry | undefined) {
  const tabs: Record<PaneId, NoteTab[]> = {
    left: [],
    "left-bottom": [],
    right: [],
    "right-bottom": [],
  };
  if (group) {
    for (const tab of group.tabs) tabs[getPaneOfTab(group, tab.id)].push(tab);
  }
  const activeTabs = Object.fromEntries(
    PANE_IDS.map((pane) => {
      const activeId = group ? getPaneActiveTabId(group, pane) : null;
      return [
        pane,
        tabs[pane].find((tab) => tab.id === activeId) ?? tabs[pane][0],
      ];
    }),
  ) as Record<PaneId, NoteTab | undefined>;
  const openPanes = PANE_IDS.filter((pane) => tabs[pane].length > 0);
  const activePane =
    group && openPanes.includes(group.activePane) ? group.activePane : "left";
  return {
    tabs,
    activeTabs,
    activePane,
    activeTab: activeTabs[activePane] ?? activeTabs.left,
    split: openPanes.length > 1,
  };
}
