path_helper: node.save: Permission denied
export type TabContextMenuTargetGroup = { id: string; name: string };

export type TabContextMenuProps = {
  left: number;
  top: number;
  deleteOnly?: boolean;
  bookmarked: boolean;
  targetGroups: TabContextMenuTargetGroup[];
  onMoveToGroup: (groupId: string) => void;
  onToggleBookmark: () => void;
  onCopyLink?: () => void;
  onCloseTab?: () => void;
  onDeleteTab?: () => void;
  onClose: () => void;
};
