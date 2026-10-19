import type { PointerEventHandler } from "react";

export type GroupItemProps = {
  groupId: string;
  dragging: boolean;
  dropTarget: boolean;
  onReorderStart: PointerEventHandler<HTMLElement>;
  onReorderKey: (direction: number) => void;
  name: string;
  active: boolean;
  pinned: boolean;
  // The default and virtual groups expose bookmarks but not destructive actions.
  editable: boolean;
  muted: boolean;
  system?: boolean;
  // Pin / edit / delete appear in a dropdown opened by the … button.
  actionsOpen: boolean;
  onToggleActions: () => void;
  onSelect: () => void;
  onRename: (name: string) => void;
  onTogglePin: () => void;
  onOpenBookmarks: () => void;
  onDelete: (anchor: HTMLElement) => void;
};
