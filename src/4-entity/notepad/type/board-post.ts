export type BoardPost = {
  id: string;
  viewerRole?: "owner" | "member" | null;
  groupName: string;
  title: string;
  description: string;
  noteCount: number;
  memberCount: number;
  updatedAt: number;
  inviteUrl: string;
};
