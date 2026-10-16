"use client";

import "./index.scss";

import { type CSSProperties, useCallback, useEffect, useState } from "react";

import { useHome } from "@/src/1-page/home/hook";
import { Footer, Panel } from "@/src/2-widget";
import { I18nContext } from "@/src/5-shared/hook";
import { MobileTapFeedback } from "@/src/5-shared/ui";

import { Loading, PaneColumn } from "./component";
import type { PaneViewProps } from "./type";

export function Home() {
  const {
    hydrated,
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
    activeTab,
    split,
    bookmarks,
    activeGroupTabs,
    tabColorCycle,
    setTabStatus,
    togglePin,
    toggleBookmark,
    moveToGroup,
    deleteDashboardTab,
    groups,
    activeGroupName,
    hasBookmarkUpdateToday,
    hasGroupUpdateToday,
    columns,
    removeBookmark,
    createGroupAndRecord,
    renameGroup,
    setGroupStatusNames,
    toggleGroupPin,
    moveGroup,
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
      <MobileTapFeedback />
      <main
        className={`home ${(backgroundPanel || (openPanel && openPanel !== "global-search" && openPanel !== "closed")) ? "is-panel-pinned" : ""}`}
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
          bookmarks={bookmarks}
          activeGroupTabs={activeGroupTabs}
          tabColorCycle={tabColorCycle}
          groups={groups}
          activeGroupId={activeGroupId}
          groupMenuOpen={groupMenuOpen}
          onCloseGroupMenu={closeGroupMenu}
          globalSearchQuery={globalSearchQuery}
          onClose={closeSidePanels}
          onGlobalSearchQueryChange={setGlobalSearchQuery}
          onOpenBookmark={openBookmarkInCurrentGroupAndClosePanel}
          onRemoveBookmark={removeBookmark}
          onOpenDashboardTab={openTabAndClosePanel}
          onChangeTabStatus={setTabStatus}
          onMoveDashboardTabToGroup={moveToGroup}
          onToggleDashboardTabPin={togglePin}
          onToggleDashboardTabBookmark={toggleBookmark}
          onDeleteDashboardTab={deleteDashboardTab}
          onCreateGroup={createGroupAndRecord}
          onSelectGroup={selectGroupAndClosePanel}
          onRemoveGroup={removeGroupAndRecord}
          onRenameGroup={renameGroup}
          onSaveDashboardStatusNames={(names) => setGroupStatusNames(activeGroupId, names)}
          onToggleGroupPin={toggleGroupPin}
          onMoveGroup={moveGroup}
        />
      </main>
    </I18nContext>
  );
}
