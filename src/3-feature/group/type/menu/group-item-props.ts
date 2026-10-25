import type { PointerEventHandler } from "react";

export type GroupItemProps = {
  groupId: string;
  shared?: boolean;
  sharingRole?: "owner" | "member";
  sharingActive?: boolean;
  onChangeSharing?: (action: "leave" | "revoke", anchor: HTMLElement) => void;
  dragging: boolean;
  dropTarget: boolean;
  onReorderStart: PointerEventHandler<HTMLElement>;
  onReorderKey: (direction: number) => void;
  name: string;
  active: boolean;
  pinned: boolean;
  // The default and virtual groups do not expose an action menu.
  editable: boolean;
  muted: boolean;
  system?: boolean;
  // Pin / edit / delete appear in a dropdown opened by the … button.
  actionsOpen: boolean;
  onToggleActions: () => void;
  onSelect: () => void;
  onRename: (name: string) => void;
  onTogglePin: () => void;
  onDelete: (anchor: HTMLElement) => void;
  onShare: () => void;
};
