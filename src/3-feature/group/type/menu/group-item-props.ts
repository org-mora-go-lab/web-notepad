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
  // The default and virtual groups only support selecting.
  editable: boolean;
  muted: boolean;
  // Pin / edit / delete appear in place of the … button once it is pressed.
  actionsOpen: boolean;
  onToggleActions: () => void;
  onSelect: () => void;
  onRename: (name: string) => void;
  onTogglePin: () => void;
  onDelete: (anchor: HTMLElement) => void;
};
