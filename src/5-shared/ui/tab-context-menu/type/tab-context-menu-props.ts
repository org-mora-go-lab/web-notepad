export type TabContextMenuTargetGroup = { id: string; name: string };

export type TabContextMenuProps = {
  left: number;
  top: number;
  moveGroupFirst?: boolean;
  deleteOnly?: boolean;
  bookmarked: boolean;
  targetGroups: TabContextMenuTargetGroup[];
  onMoveToGroup: (groupId: string) => void;
  onToggleBookmark: () => void;
  onCloseTab?: () => void;
  onDeleteTab?: () => void;
  onClose: () => void;
};
