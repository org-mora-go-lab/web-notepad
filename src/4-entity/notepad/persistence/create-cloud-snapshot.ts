import type { NotepadState } from "../type";
import { isSharedGroupId } from "../util";

export function createCloudSnapshot(state: NotepadState) {
  return JSON.stringify({
    nextTabNumber: state.nextTabNumber,
    groups: state.groups.filter(group => !isSharedGroupId(group.id)),
    activeGroupId: isSharedGroupId(state.activeGroupId) ? "ungrouped" : state.activeGroupId,
    closedTabs: state.closedTabs.filter(entry => !isSharedGroupId(entry.groupId)),
    allGroupActiveTabId: state.allGroupActiveTabId,
    allGroupLayout: state.allGroupLayout,
    allGroupDashboardVisibility: state.allGroupDashboardVisibility,
    settings: state.settings,
  });
}
