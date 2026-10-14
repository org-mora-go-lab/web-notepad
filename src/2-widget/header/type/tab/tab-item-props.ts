import type { NoteTab } from "@/src/4-entity/notepad";

export type TabItemProps = {
  tab: NoteTab;
  active: boolean;
  draggingTabId: string | null;
  dragActive: boolean;
  dropTarget: boolean;
  onSelect: (tabId: string) => void;
  onClose: (tabId: string) => void;
  onCycleTabColor: (tabId: string) => void;
  onContextMenu: (tabId: string, clientX: number, clientY: number) => void;
  onDragStateChange: (tabId: string | null) => void;
  onDropTargetChange: (tabId: string | null) => void;
  onDrop: (fromTabId: string, toTabId: string) => void;
  onDragEnd: () => void;
};
