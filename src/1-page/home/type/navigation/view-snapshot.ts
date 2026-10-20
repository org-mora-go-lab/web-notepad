import type { PaneId } from "@/src/4-entity/notepad";
import type { ViewPanel } from "@/src/5-shared";

export type ViewSnapshot = {
  groupId: string;
  leftTabId: string;
  rightTabId: string | null;
  leftBottomTabId: string | null;
  rightBottomTabId: string | null;
  pane: PaneId;
  panel: ViewPanel | null;
  groupMenuOpen?: boolean;
};
