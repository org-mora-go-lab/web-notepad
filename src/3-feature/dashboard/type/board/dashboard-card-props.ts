import type { DragEvent } from "react";

import type { NoteTab } from "@/src/4-entity/notepad";

export type DashboardCardProps = {
  tab: NoteTab;
  // Drag identity; defaults to the tab id (closed entries pass their entry id).
  id?: string;
  groupName?: string;
  dragging: boolean;
  active?: boolean;
  onOpen: (tabId: string) => void;
  onDragStart: (tabId: string, event: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
};
