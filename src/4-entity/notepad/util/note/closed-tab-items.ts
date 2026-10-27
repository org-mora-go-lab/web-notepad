import { UNGROUPED_GROUP_ID } from "../../constant";
import type { ClosedTabEntry, GroupEntry } from "../../type";

// Resolve deleted groups consistently without scanning every group for every entry.
export function getClosedTabItems(
  closedTabs: ClosedTabEntry[],
  groups: GroupEntry[],
) {
  const groupNames = new Map(groups.map((group) => [group.id, group.name]));
  return closedTabs.map((entry) => ({
    entry,
    groupId: groupNames.has(entry.groupId) ? entry.groupId : UNGROUPED_GROUP_ID,
    groupName: groupNames.get(entry.groupId) ?? "Ungrouped",
  }));
}
