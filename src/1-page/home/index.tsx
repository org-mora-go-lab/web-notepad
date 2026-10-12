"use client";

import "./index.scss";

import { useHome } from "@/src/1-page/home/hook";
import { Footer, Panel } from "@/src/2-widget";

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
    restoreClosedTabAndClosePanel,
    activeTab,
    split,
    bookmarks,
    groups,
    activeGroupName,
    hasBookmarkUpdateToday,
    panelPinned,
    togglePanelPin,
    columns,
    removeBookmark,
    createGroup,
    renameGroup,
    removeGroup,
  } = useHome();

  // The MENU's CLOSED and SHORTCUT commands open their side panels.
  const withMenu = (pane: PaneViewProps): PaneViewProps =>
    pane.hasMenu
      ? {
          ...pane,
          closedCount: closedTabs.length,
          onOpenClosed: () => {
            if (openPanel !== "closed") toggleSidePanel("closed");
          },
          onOpenShortcuts: () => {
            if (openPanel !== "shortcuts") toggleSidePanel("shortcuts");
          },
        }
      : pane;

  if (!hydrated || !activeTab) {
    return <Loading />;
  }

  return (
    <main className={`home ${panelPinned && openPanel ? "is-panel-pinned" : ""}`}>
      <section className="workspace">
        <div className={`pane-group ${split ? "is-split" : ""}`}>
          {columns.map((column) => (
            <PaneColumn key={column.column} {...column} panes={column.panes.map(withMenu)} />
          ))}
        </div>

        <Footer
          hasBookmarkUpdateToday={hasBookmarkUpdateToday}
          bookmarksOpen={openPanel === "bookmarks"}
          activeGroupName={activeGroupName}
          groupsOpen={openPanel === "groups"}
          globalSearchOpen={openPanel === "global-search"}
          onToggleBookmarks={() => toggleSidePanel("bookmarks")}
          onToggleGroups={() => toggleSidePanel("groups")}
          onToggleGlobalSearch={() => toggleSidePanel("global-search")}
        />
      </section>

      <Panel
        openPanel={openPanel}
        pinned={panelPinned}
        onTogglePin={togglePanelPin}
        bookmarks={bookmarks}
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
        onCreateGroup={createGroup}
        onSelectGroup={selectGroupAndClosePanel}
        onRemoveGroup={removeGroup}
        onRenameGroup={renameGroup}
        onRestoreClosedTab={restoreClosedTabAndClosePanel}
        onRemoveClosedTab={removeClosedTab}
        onOpenSearchedBookmark={openBookmarkAndClosePanel}
        onOpenClosedSearch={(query) => {
          setClosedSearchQuery(query);
          toggleSidePanel("closed");
        }}
      />
      {pendingCloseTabId && (
        <TabDeletePopup onConfirm={confirmCloseTab} onCancel={cancelCloseTab} />
      )}
    </main>
  );
}
