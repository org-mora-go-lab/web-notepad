import type { NoteTab } from "@/src/4-entity/notepad";

export type TabItemProps = {
  tab: NoteTab;
  active: boolean;
  draggingTabId: string | null;
  selected: boolean;
  dragActive: boolean;
  dropTarget: boolean;
  onSelect: (tabId: string, extendSelection: boolean) => void;
  onClose: (tabId: string) => void;
  onCycleTabColor: (tabId: string) => void;
  onContextMenu: (tabId: string, clientX: number, clientY: number) => void;
  onDragStart: (tabId: string) => void;
  onDropTargetChange: (tabId: string | null) => void;
  onDrop: (fromTabId: string, toTabId: string) => void;
  onDragEnd: () => void;
};
