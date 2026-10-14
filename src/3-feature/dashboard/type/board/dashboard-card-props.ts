import type { DragEvent } from "react";

import type { NoteTab, TabStatus } from "@/src/4-entity/notepad";

export type DashboardCardProps = {
  tab: NoteTab;
  // Drag identity; defaults to the tab id (closed entries pass their entry id).
  id?: string;
  closed?: boolean;
  groupName?: string;
  status: TabStatus;
  dragging: boolean;
  active?: boolean;
  onOpen: (tabId: string) => void;
  onOpenContextMenu?: (tabId: string, clientX: number, clientY: number) => void;
  onDragStart: (
    tabId: string,
    closed: boolean,
    event: DragEvent<HTMLElement>,
  ) => void;
  onChangeStatus: (itemId: string, closed: boolean, status: TabStatus) => void;
  onDragEnd: () => void;
};
