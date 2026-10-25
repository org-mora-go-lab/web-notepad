export type GroupSharingAccess = { role: "owner" | "member"; active: boolean };
export type GroupSharingActions = {
  accessByGroup: Record<string, GroupSharingAccess>;
  changeAccess: (groupId: string, action: "leave" | "revoke") => Promise<boolean>;
};
