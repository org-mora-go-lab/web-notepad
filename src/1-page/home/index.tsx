"use client";

import "./index.scss";

import { useHome } from "@/src/1-page/home/hook";
import { Footer, Panel } from "@/src/2-widget";

import { Loading, PaneView, TabDeletePopup } from "./component";

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
    leftPaneProps,
    rightPaneProps,
    removeBookmark,
    createGroup,
    renameGroup,
    removeGroup,
  } = useHome();

  if (!hydrated || !activeTab) {
    return <Loading />;
  }

  return (
    <main className="home">
      <section className="workspace">
        <div className={`pane-group ${split ? "is-split" : ""}`}>
          {leftPaneProps && <PaneView {...leftPaneProps} closedCount={closedTabs.length}
            onOpenClosed={rightPaneProps ? undefined : () => {
              if (openPanel !== "closed") toggleSidePanel("closed");
            }} onOpenShortcuts={rightPaneProps ? undefined : () => {
            if (openPanel !== "shortcuts") toggleSidePanel("shortcuts");
          }} />}
          {rightPaneProps && <PaneView {...rightPaneProps} closedCount={closedTabs.length}
            onOpenClosed={() => {
              if (openPanel !== "closed") toggleSidePanel("closed");
            }} onOpenShortcuts={() => {
            if (openPanel !== "shortcuts") toggleSidePanel("shortcuts");
          }} />}
        </div>

        <Footer
          bookmarkCount={bookmarks.length}
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
