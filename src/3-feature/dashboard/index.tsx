"use client";

import { getDashboardColumns } from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";
import { ConfirmPopup, SidePanel } from "@/src/5-shared/ui";

import { DashboardColumn, DashboardStatuses } from "./component";
import { useDashboardDrag, useDashboardScroll } from "./hook";
import type { DashboardProps } from "./type";

export function Dashboard({
  tabs,
  activeTabId,
  closedTabs,
  groups,
  showGroupNames,
  tabColorCycle,
  open,
  pinned,
  onTogglePin,
  onClose,
  onOpenTab,
  onChangeStatus,
  onUnpinTab,
  onRestoreClosed,
  onChangeClosedStatus,
}: DashboardProps) {
  const { t } = useI18n();
  const { contentRef, listRef, boardRef } = useDashboardScroll();
  const columns = getDashboardColumns(tabs, closedTabs, tabColorCycle);
  const visibleTabs = columns.flatMap((column) => column.tabs);
  const drag = useDashboardDrag({
    visibleTabs,
    onChangeStatus,
    onChangeClosedStatus,
    onUnpinTab,
  });
  return (
    <SidePanel
      className="dashboard"
      id="dashboard-panel"
      title={t.dashboardTitle}
      open={open}
      pinned={pinned}
      onTogglePin={onTogglePin}
      closeLabel={t.closePanel(t.dashboardTitle)}
      ariaLabel={t.dashboardTitle}
      onClose={onClose}
    >
      <div className="dashboard-content" ref={contentRef}>
        <DashboardStatuses columns={columns} tabColorCycle={tabColorCycle} />
        <div className="dashboard-list" ref={listRef}>
          <div className="dashboard-board" ref={boardRef}>
            {columns.map((column) => (
              <DashboardColumn
                key={column.status}
                column={column}
                drag={drag}
                activeTabId={activeTabId}
                groups={groups}
                showGroupNames={showGroupNames}
                tabColorCycle={tabColorCycle}
                onRestoreClosed={onRestoreClosed}
                onOpenTab={onOpenTab}
              />
            ))}
          </div>
        </div>
      </div>
      {drag.pendingPinnedTabId && (
        <ConfirmPopup
          title={t.closePinnedTabTitle}
          message={t.closePinnedTabMessage}
          closeLabel={t.closePanel(t.closePinnedTabTitle)}
          closeTitle={t.close}
          confirmLabel={t.unpinAndClose}
          onConfirm={drag.confirmClose}
          onCancel={drag.cancelClose}
        />
      )}
    </SidePanel>
  );
}
