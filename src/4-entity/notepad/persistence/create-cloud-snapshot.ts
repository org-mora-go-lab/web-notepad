import type { NotepadState } from "../type";

export function createCloudSnapshot(state: NotepadState) {
  return JSON.stringify({
    nextTabNumber: state.nextTabNumber,
    groups: state.groups,
    activeGroupId: state.activeGroupId,
    closedTabs: state.closedTabs,
    allGroupActiveTabId: state.allGroupActiveTabId,
    allGroupLayout: state.allGroupLayout,
    allGroupDashboardVisibility: state.allGroupDashboardVisibility,
    settings: state.settings,
  });
}
