export type TabContextMenuTargetGroup = { id: string; name: string };

export type TabContextMenuProps = {
  left: number;
  top: number;
  pinned: boolean;
  showPin?: boolean;
  bookmarked: boolean;
  targetGroups: TabContextMenuTargetGroup[];
  onMoveToGroup: (groupId: string) => void;
  onTogglePin: () => void;
  onToggleBookmark: () => void;
  onCloseTab?: () => void;
  onClose: () => void;
};
