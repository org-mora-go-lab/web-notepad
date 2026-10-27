"use client";

import "./index.scss";

import { useRouter } from "next/navigation";
import { type CSSProperties, useEffect, useRef, useState } from "react";

import { useCloudSave, useHome, useSharedGroups } from "@/src/1-page/home/hook";
import { Footer, Panel } from "@/src/2-widget";
import { useNotepadStore } from "@/src/4-entity/notepad";
import { MESSAGES } from "@/src/5-shared/constant";
import {
  AccountActionsContext,
  GroupSharingContext,
  I18nContext,
  SavingTabsContext,
} from "@/src/5-shared/hook";
import { MobileTapFeedback } from "@/src/5-shared/ui";

import { Loading, PaneColumn } from "./component";

export function Home() {
  const router = useRouter();
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
    openSearchTabAndClosePanel,
    activeTab,
    split,
    bookmarks,
    activeGroupTabs,
    tabColorCycle,
    setTabStatus,
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
  const { status: cloudSaveStatus, savingTabIds } = useCloudSave(hydrated);
  const shared = useSharedGroups(hydrated);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { inviteStatus, dismissInvite } = shared;
  const entryOpened = useRef(false);
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
    document.documentElement.style.setProperty(
      "--font-scale",
      String(fontScale),
    );
  }, [language, fontScale]);

  useEffect(() => {
    if (!hydrated || entryOpened.current) return;
    entryOpened.current = true;
    const panel = new URLSearchParams(window.location.search).get("panel");
    if (panel === "board") {
      router.replace("/board");
      return;
    }
    if (panel === "settings") {
      closeGroupMenu();
      toggleSidePanel(panel);
    }
  }, [hydrated, closeGroupMenu, toggleSidePanel, router]);

  useEffect(() => {
    if (!inviteStatus || inviteStatus === "joining") return;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const controls = () =>
      Array.from(
        inviteRef.current?.querySelectorAll<HTMLElement>("a[href], button") ??
          [],
      );
    controls()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dismissInvite();
        return;
      }
      if (event.key !== "Tab") return;
      const items = controls();
      if (!items.length) return;
      if (event.shiftKey && document.activeElement === items[0]) {
        event.preventDefault();
        items[items.length - 1].focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === items[items.length - 1]
      ) {
        event.preventDefault();
        items[0].focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [inviteStatus, dismissInvite]);

  if (!hydrated || !activeTab) {
    return <Loading />;
  }

  return (
    <I18nContext value={language}>
      <AccountActionsContext
        value={{
          onOpenSettings: () => {
            closeGroupMenu();
            if (openPanel !== "settings") toggleSidePanel("settings");
          },
          onOpenNotifications: () => {
            setNotificationsOpen(true);
            void shared.refreshNotifications();
          },
        }}
      >
        <GroupSharingContext
          value={{
            loading: shared.loading || shared.checkingGroups,
            refreshGroups: shared.refreshGroups,
            accessByGroup: shared.accessByGroup,
            changeAccess: shared.changeAccess,
          }}
        >
          <SavingTabsContext value={[...savingTabIds, ...shared.savingTabIds]}>
            <MobileTapFeedback />
            <main
              className={`home ${groupMenuOpen ? "is-group-sidebar-open" : ""} ${backgroundPanel || (openPanel && openPanel !== "global-search" && openPanel !== "closed" && openPanel !== "bookmarks") ? "is-panel-pinned" : ""}`}
              style={{ "--font-scale": fontScale } as CSSProperties}
              data-panel-position={panelPosition}
              data-panel-slide={panelSlide ? "on" : "off"}
              data-cloud-save={cloudSaveStatus ?? "idle"}
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
                  dashboardOpen={
                    openPanel === "dashboard" || backgroundPanel === "dashboard"
                  }
                  activeGroupName={activeGroupName}
                  groupsOpen={groupMenuOpen}
                  onToggleDashboard={() => toggleSidePanel("dashboard")}
                  onToggleGroups={toggleGroupMenu}
                  onOpenBoard={() => router.push("/board")}
                  onOpenShortcuts={() => toggleSidePanel("shortcuts")}
                  onToggleBookmarks={() => toggleSidePanel("bookmarks")}
                  onToggleSearch={() => toggleSidePanel("global-search")}
                  searchOpen={openPanel === "global-search"}
                  notificationsOpen={notificationsOpen}
                  onNotificationsOpenChange={setNotificationsOpen}
                  notifications={shared.notifications}
                  onClearNotifications={shared.clearNotifications}
                  onOpenNotification={async (item) => {
                    await shared.refreshGroups();
                    const group = useNotepadStore
                      .getState()
                      .groups.find((group) => group.id === item.groupId);
                    if (!group) return;
                    void shared.markNotificationsRead(item.id);
                    selectGroupAndClosePanel(group.id);
                    const tab =
                      group.tabs.find((tab) => tab.id === item.tabId) ??
                      group.tabs.find((tab) => tab.open) ??
                      group.tabs[0];
                    if (tab) openTabAndClosePanel(tab.id);
                  }}
                />
              </section>

              {cloudSaveStatus && (
                <span
                  className="cloud-save-announcement"
                  role="status"
                  aria-live="polite"
                >
                  {cloudSaveText[cloudSaveStatus]}
                </span>
              )}
              {inviteStatus && (
                <div className="share-invite-backdrop">
                  <section
                    ref={inviteRef}
                    className="share-invite-dialog"
                    role="dialog"
                    aria-modal="true"
                    aria-label={messages.shareGroup}
                  >
                    <p>
                      {inviteStatus === "login"
                        ? messages.shareInviteLogin
                        : inviteStatus === "joining"
                          ? messages.shareInviteJoining
                          : inviteStatus === "joined"
                            ? messages.shareInviteJoined
                            : messages.shareInviteError}
                    </p>
                    {inviteStatus === "login" && shared.inviteToken && (
                      <a
                        href={`/api/auth/oauth/kakao?share=${encodeURIComponent(shared.inviteToken)}`}
                      >
                        {messages.kakaoLogin}
                      </a>
                    )}
                    {inviteStatus !== "joining" && (
                      <button type="button" onClick={dismissInvite}>
                        {messages.close}
                      </button>
                    )}
                  </section>
                </div>
              )}

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
                onToggleDashboardTabBookmark={toggleBookmark}
                onDeleteDashboardTab={deleteDashboardTab}
                onCreateGroup={createGroupAndRecord}
                onSelectGroup={selectGroupAndClosePanel}
                onSelectSearchTab={openSearchTabAndClosePanel}
                onRemoveGroup={removeGroupAndRecord}
                onRenameGroup={renameGroup}
                onSaveDashboardStatusNames={(names) =>
                  setGroupStatusNames(activeGroupId, names)
                }
                dashboardVisibility={dashboardVisibility}
                onDashboardVisibilityChange={(visibility) =>
                  setGroupDashboardVisibility(activeGroupId, visibility)
                }
                onToggleGroupPin={toggleGroupPin}
                onMoveGroup={moveGroup}
              />
            </main>
          </SavingTabsContext>
        </GroupSharingContext>
      </AccountActionsContext>
    </I18nContext>
  );
}
