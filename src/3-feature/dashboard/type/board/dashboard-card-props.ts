import type { DragEvent } from "react";

import type { NoteTab, TabStatus } from "@/src/4-entity/notepad";

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
  onTouchDragStart: (tabId: string) => void;
  onTouchDragOver: (status: TabStatus | null) => void;
  onTouchDrop: (tabId: string, status: TabStatus | null) => void;
};
