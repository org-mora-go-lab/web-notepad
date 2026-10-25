"use client";

import "./index.scss";

import { type CSSProperties, useEffect, useRef } from "react";

import { useCloudSave, useHome, useSharedGroups } from "@/src/1-page/home/hook";
import { Footer, Panel } from "@/src/2-widget";
import { MESSAGES } from "@/src/5-shared/constant";
import { I18nContext } from "@/src/5-shared/hook";
import { MobileTapFeedback } from "@/src/5-shared/ui";

import { Loading, PaneColumn } from "./component";

export function Home() {
  const {
    hydrated,
    groupMenuOpen,
    closeGroupMenu,
    toggleGroupMenu,
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
    hasGroupUpdateToday,
    columns,
    removeBookmark,
    createGroupAndRecord,
    renameGroup,
    setGroupStatusNames,
    setGroupDashboardVisibility,
    dashboardVisibility,
    toggleGroupPin,
    moveGroup,
    removeGroupAndRecord,
    fontScale,
    language,
    panelSlide,
    panelPosition,
  } = useHome();
  const cloudSaveStatus = useCloudSave(hydrated);
  const shared = useSharedGroups(hydrated);
  const inviteRef = useRef<HTMLElement>(null);
  const messages = MESSAGES[language];
  const cloudSaveText = {
    pending: messages.cloudPending,
    saving: messages.cloudSaving,
    saved: messages.cloudSaved,
    error: messages.cloudError,
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (!shared.inviteStatus || shared.inviteStatus === "joining") return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const controls = () => Array.from(inviteRef.current?.querySelectorAll<HTMLElement>("a[href], button") ?? []);
    controls()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); shared.dismissInvite(); return; }
      if (event.key !== "Tab") return;
      const items = controls();
      if (!items.length) return;
      if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items[items.length - 1].focus(); }
      else if (!event.shiftKey && document.activeElement === items[items.length - 1]) { event.preventDefault(); items[0].focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); previous?.focus(); };
  }, [shared.inviteStatus, shared.dismissInvite]);

  if (!hydrated || !activeTab) {
    return <Loading />;
  }

  return (
    <I18nContext value={language}>
      <MobileTapFeedback />
      <main
        className={`home ${groupMenuOpen ? "is-group-sidebar-open" : ""} ${(backgroundPanel || (openPanel && openPanel !== "global-search" && openPanel !== "closed")) ? "is-panel-pinned" : ""}`}
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
                panes={column.panes}
              />
            ))}
          </div>

          <Footer
            hasGroupUpdateToday={hasGroupUpdateToday}
            dashboardOpen={openPanel === "dashboard" || backgroundPanel === "dashboard"}
            activeGroupName={activeGroupName}
            groupsOpen={groupMenuOpen}
            onToggleDashboard={() => toggleSidePanel("dashboard")}
            onToggleGroups={toggleGroupMenu}
            onOpenSettings={() => toggleSidePanel("settings")}
            onOpenShortcuts={() => toggleSidePanel("shortcuts")}
            onToggleBookmarks={() => toggleSidePanel("bookmarks")}
            onToggleSearch={() => toggleSidePanel("global-search")}
            searchOpen={openPanel === "global-search"}
            notifications={shared.notifications}
            unreadCount={shared.unreadCount}
            onMarkNotificationsRead={() => void shared.markNotificationsRead()}
          />
        </section>

        {cloudSaveStatus && (
          <div className={`cloud-save-status is-${cloudSaveStatus}`} role="status" aria-live="polite">
            <span className="cloud-save-mark" aria-hidden="true" />
            <span>{cloudSaveText[cloudSaveStatus]}</span>
          </div>
        )}
        {shared.inviteStatus && <div className="share-invite-backdrop">
          <section ref={inviteRef} className="share-invite-dialog" role="dialog" aria-modal="true" aria-label={messages.shareGroup}>
            <p>{shared.inviteStatus === "login" ? messages.shareInviteLogin
              : shared.inviteStatus === "joining" ? messages.shareInviteJoining
                : shared.inviteStatus === "joined" ? messages.shareInviteJoined
                  : messages.shareInviteError}</p>
            {shared.inviteStatus === "login" && shared.inviteToken &&
              <a href={`/api/auth/oauth/kakao?share=${encodeURIComponent(shared.inviteToken)}`}>{messages.kakaoLogin}</a>}
            {shared.inviteStatus !== "joining" &&
              <button type="button" onClick={shared.dismissInvite}>{messages.close}</button>}
          </section>
        </div>}

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
          dashboardVisibility={dashboardVisibility}
          onDashboardVisibilityChange={(visibility) => setGroupDashboardVisibility(activeGroupId, visibility)}
          onToggleGroupPin={toggleGroupPin}
          onMoveGroup={moveGroup}
        />
      </main>
    </I18nContext>
  );
}
