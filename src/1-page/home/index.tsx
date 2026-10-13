"use client";

import "./index.scss";

import { type CSSProperties, useEffect } from "react";

import { useHome } from "@/src/1-page/home/hook";
import { Footer, Panel } from "@/src/2-widget";
import { I18nContext } from "@/src/5-shared/hook";

import { Loading, PaneColumn, TabDeletePopup } from "./component";
import type { PaneViewProps } from "./type";

export function Home() {
  const {
    hydrated,
    closedTabs,
    removeClosedTab,
    globalSearchQuery,
    setGlobalSearchQuery,
    closedSearchQuery,
    setClosedSearchQuery,
    pendingCloseTabId,
    cancelCloseTab,
    confirmCloseTab,
    openPanel,
    toggleSidePanel,
    closeSidePanels,
    activeGroupId,
    selectGroupAndClosePanel,
    openBookmarkAndClosePanel,
    openBookmarkInCurrentGroupAndClosePanel,
    openTabAndClosePanel,
    restoreClosedTabAndClosePanel,
    activeTab,
    split,
    bookmarks,
    activeGroupTabs,
    tabColorCycle,
    setTabStatus,
    moveClosedTabToStatus,
    groups,
    activeGroupName,
    hasBookmarkUpdateToday,
    panelPinned,
    togglePanelPin,
    columns,
    removeBookmark,
    createGroup,
    renameGroup,
    toggleGroupPin,
    removeGroup,
    fontScale,
    language,
    panelSlide,
  } = useHome();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // MENU commands open their side panels.
  const withMenu = (pane: PaneViewProps): PaneViewProps =>
    pane.hasMenu
      ? {
          ...pane,
          closedCount: closedTabs.length,
          onOpenClosed: () => {
            if (openPanel !== "closed") toggleSidePanel("closed");
          },
          onOpenSettings: () => {
            if (openPanel !== "settings") toggleSidePanel("settings");
          },
          onOpenShortcuts: () => {
            if (openPanel !== "shortcuts") toggleSidePanel("shortcuts");
          },
          onOpenSearch: () => {
            if (openPanel !== "global-search") toggleSidePanel("global-search");
          },
        }
      : pane;

  if (!hydrated || !activeTab) {
    return <Loading />;
  }

  return (
    <I18nContext value={language}>
      <main
        className={`home ${panelPinned && openPanel ? "is-panel-pinned" : ""}`}
        style={{ "--font-scale": fontScale } as CSSProperties}
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
            bookmarksOpen={openPanel === "bookmarks"}
            dashboardOpen={openPanel === "dashboard"}
            activeGroupName={activeGroupName}
            groupsOpen={openPanel === "groups"}
            onToggleBookmarks={() => toggleSidePanel("bookmarks")}
            onToggleDashboard={() => toggleSidePanel("dashboard")}
            onToggleGroups={() => toggleSidePanel("groups")}
          />
        </section>

        <Panel
          openPanel={openPanel}
          pinned={panelPinned}
          onTogglePin={togglePanelPin}
          bookmarks={bookmarks}
          activeGroupName={activeGroupName}
          activeGroupTabs={activeGroupTabs}
          tabColorCycle={tabColorCycle}
          groups={groups}
          activeGroupId={activeGroupId}
          closedTabs={closedTabs}
          closedSearchQuery={closedSearchQuery}
          globalSearchQuery={globalSearchQuery}
          onClose={closeSidePanels}
          onClosedSearchQueryChange={setClosedSearchQuery}
          onGlobalSearchQueryChange={setGlobalSearchQuery}
          onOpenBookmark={openBookmarkInCurrentGroupAndClosePanel}
          onRemoveBookmark={removeBookmark}
          onOpenDashboardTab={openTabAndClosePanel}
          onChangeTabStatus={setTabStatus}
          onChangeClosedTabStatus={moveClosedTabToStatus}
          onCreateGroup={createGroup}
          onSelectGroup={selectGroupAndClosePanel}
          onRemoveGroup={removeGroup}
          onRenameGroup={renameGroup}
          onToggleGroupPin={toggleGroupPin}
          onRestoreClosedTab={restoreClosedTabAndClosePanel}
          onRemoveClosedTab={removeClosedTab}
          onOpenSearchedBookmark={openBookmarkAndClosePanel}
          onOpenClosedSearch={(query) => {
            setClosedSearchQuery(query);
            toggleSidePanel("closed");
          }}
        />
        {pendingCloseTabId && (
          <TabDeletePopup
            onConfirm={confirmCloseTab}
            onCancel={cancelCloseTab}
          />
        )}
      </main>
    </I18nContext>
  );
}
