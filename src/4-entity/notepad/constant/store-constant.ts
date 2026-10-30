export const MIN_SPLIT_RATIO = 0.2;
export const MAX_SPLIT_RATIO = 0.8;
export const UNGROUPED_GROUP_ID = "ungrouped";
// Virtual read-only group that lists the tabs of every group.
export const ALL_GROUP_ID = "all-group";
export const ALL_GROUP_NAME = "All Group";
export const ALL_MY_GROUP_ID = "all-my-group";
export const ALL_MY_GROUP_NAME = "All My Group";
export const ALL_SHARED_GROUP_ID = "all-shared-group";
export const ALL_SHARED_GROUP_NAME = "All Shared Group";

export const isAggregateGroupId = (groupId: string) =>
  groupId === ALL_GROUP_ID ||
  groupId === ALL_MY_GROUP_ID ||
  groupId === ALL_SHARED_GROUP_ID;
