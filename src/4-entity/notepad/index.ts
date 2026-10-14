export {
  DEFAULT_SETTINGS,
  FONT_SCALES,
  TAB_COLORS,
  TAB_STATUSES,
} from "./constant";
export { useNotepadHydrated } from "./hook";
export * from "./store";
export * from "./type";
export type { DashboardColumnData } from "./util";
export {
  compareGroups,
  getBottomPane,
  getClosedTabItems,
  getDashboardColumns,
  getPaneActiveTabId,
  getPaneColumn,
  getPaneOfTab,
  getPaneTabs,
  getPaneWorkspace,
  getStatusColor,
  getTabStatus,
  isSubstantialContent,
  PANE_IDS,
} from "./util";
