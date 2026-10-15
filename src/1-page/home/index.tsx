"use client";

import "./index.scss";

import { type CSSProperties, useCallback, useEffect, useState } from "react";

import { useHome } from "@/src/1-page/home/hook";
import { Footer, Panel } from "@/src/2-widget";
import { I18nContext } from "@/src/5-shared/hook";

import { Loading, PaneColumn } from "./component";
import type { PaneViewProps } from "./type";

export function Home() {
  const {
    hydrated,
    closedTabs,
    globalSearchQuery,
    setGlobalSearchQuery,
    openPanel,
    backgroundPanel,
    toggleSidePanel,
    closeSidePanels,
    activeGroupId,
    selectGroupAndClosePanel,
    openBookmarkInCurrentGroupAndClosePanel,
    openTabAndClosePanel,
    restoreClosedTabAndClosePanel,
    activeTab,
    split,
    bookmarks,
    activeGroupTabs,
    tabColorCycle,
    dashboardStatusNames,
    setDashboardStatusName,
    setTabStatus,
    togglePin,
    toggleBookmark,
    moveToGroup,
    archiveDashboardTab,
    removeClosedTab,
    groups,
    activeGroupName,
    hasBookmarkUpdateToday,
    hasGroupUpdateToday,
    panelPinned,
    togglePanelPin,
    columns,
    removeBookmark,
    createGroupAndRecord,
    renameGroup,
    toggleGroupPin,
    removeGroupAndRecord,
    fontScale,
    language,
    panelSlide,
    panelPosition,
  } = useHome();

  const [groupMenuOpen, setGroupMenuOpen] = useState(false);
  const closeGroupMenu = useCallback(() => setGroupMenuOpen(false), []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // MENU commands open their side panels.
  const withMenu = (pane: PaneViewProps): PaneViewProps =>
    pane.hasMenu
      ? {
          ...pane,
          onOpenSettings: () => {
            if (openPanel !== "settings") toggleSidePanel("settings");
          },
          onOpenShortcuts: () => {
            if (openPanel !== "shortcuts") toggleSidePanel("shortcuts");
          },
          onToggleSearch: () => toggleSidePanel("global-search"),
          searchOpen: openPanel === "global-search",
          onSelectGroup: selectGroupAndClosePanel,
        }
      : pane;

  if (!hydrated || !activeTab) {
    return <Loading />;
  }

  return (
    <I18nContext value={language}>
      <main
        className={`home ${panelPinned && (backgroundPanel || (openPanel && openPanel !== "global-search" && openPanel !== "closed")) ? "is-panel-pinned" : ""}`}
        style={{ "--font-scale": fontScale } as CSSProperties}
        data-panel-position={panelPosition}
        data-panel-slide={panelSlide ? "on" : "off"}
      >
        <section className="workspace">
          <div className={`pane-group ${split ? "is-split" : ""}`}>
            {columns.map((column) => (
              <PaneColumn
                key={column.column}
                {...column}
                panes={column.panes.map(withMenu)}
              />
            ))}
          </div>

          <Footer
            hasBookmarkUpdateToday={hasBookmarkUpdateToday}
            hasGroupUpdateToday={hasGroupUpdateToday}
            bookmarksOpen={openPanel === "bookmarks" || backgroundPanel === "bookmarks"}
            dashboardOpen={openPanel === "dashboard" || backgroundPanel === "dashboard"}
            activeGroupName={activeGroupName}
            groupsOpen={groupMenuOpen}
            onToggleBookmarks={() => toggleSidePanel("bookmarks")}
            onToggleDashboard={() => toggleSidePanel("dashboard")}
            onToggleGroups={() => setGroupMenuOpen((current) => !current)}
          />
        </section>

        <Panel
          activeTabId={activeTab?.id}
          openPanel={openPanel}
          backgroundPanel={backgroundPanel}
          pinned={panelPinned}
          onTogglePin={togglePanelPin}
          bookmarks={bookmarks}
          activeGroupTabs={activeGroupTabs}
          tabColorCycle={tabColorCycle}
          dashboardStatusNames={dashboardStatusNames}
          groups={groups}
          activeGroupId={activeGroupId}
          groupMenuOpen={groupMenuOpen}
          onCloseGroupMenu={closeGroupMenu}
          closedTabs={closedTabs}
          globalSearchQuery={globalSearchQuery}
          onClose={closeSidePanels}
          onGlobalSearchQueryChange={setGlobalSearchQuery}
          onOpenBookmark={openBookmarkInCurrentGroupAndClosePanel}
          onRemoveBookmark={removeBookmark}
          onOpenDashboardTab={openTabAndClosePanel}
          onChangeTabStatus={setTabStatus}
          onRenameDashboardStatus={setDashboardStatusName}
          onMoveDashboardTabToGroup={moveToGroup}
          onToggleDashboardTabPin={togglePin}
          onToggleDashboardTabBookmark={toggleBookmark}
          onArchiveDashboardTab={archiveDashboardTab}
          onRemoveClosedTab={removeClosedTab}
          onOpenClosed={() => {
            if (openPanel !== "closed") toggleSidePanel("closed");
          }}
          onCreateGroup={createGroupAndRecord}
          onSelectGroup={selectGroupAndClosePanel}
          onRemoveGroup={removeGroupAndRecord}
          onRenameGroup={renameGroup}
          onToggleGroupPin={toggleGroupPin}
          onRestoreClosedTab={restoreClosedTabAndClosePanel}
        />
      </main>
    </I18nContext>
  );
}
