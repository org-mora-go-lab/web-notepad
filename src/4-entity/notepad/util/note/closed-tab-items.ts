import type { ClosedTabEntry, GroupEntry } from "../../type";

// Resolve deleted groups consistently without scanning every group for every entry.
export function getClosedTabItems(
  closedTabs: ClosedTabEntry[],
  groups: GroupEntry[],
) {
  const groupNames = new Map(groups.map((group) => [group.id, group.name]));
  return closedTabs.map((entry) => ({
    entry,
    groupName: groupNames.get(entry.groupId) ?? "Ungrouped",
  }));
}
