import type { DragEvent } from "react";

import type { NoteTab } from "@/src/4-entity/notepad";

export type DashboardCardProps = {
  tab: NoteTab;
  groupName?: string;
  dragging: boolean;
  active?: boolean;
  contextMenuTarget?: boolean;
  onOpen: (tabId: string) => void;
  onOpenContextMenu?: (tabId: string, clientX: number, clientY: number) => void;
  onDragStart: (tabId: string, event: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
};
