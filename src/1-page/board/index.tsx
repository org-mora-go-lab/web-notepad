"use client";

import "./index.scss";

import { useEffect } from "react";

import { Board } from "@/src/3-feature";
import {
  useCloudSave,
  useNotepadHydrated,
  useNotepadStore,
  useSharedGroups,
} from "@/src/4-entity/notepad";
import { HOME_RETURN_FOCUS_KEY } from "@/src/5-shared/constant";
import { GroupSharingContext, I18nContext } from "@/src/5-shared/hook";

function markBoardReturn() {
  try {
    sessionStorage.setItem(HOME_RETURN_FOCUS_KEY, "1");
  } catch {
    /* Keep navigation usable if session storage is unavailable. */
  }
}

export function BoardPage() {
  const hydrated = useNotepadHydrated();
  const settings = useNotepadStore((state) => state.settings);
  useCloudSave(hydrated);
  const shared = useSharedGroups(hydrated);
  useEffect(markBoardReturn, []);
  useEffect(() => {
    document.documentElement.lang = settings.language;
    document.documentElement.style.setProperty(
      "--font-scale",
      String(settings.fontScale),
    );
  }, [settings.language, settings.fontScale]);
  return (
    <I18nContext value={settings.language}>
      <GroupSharingContext
        value={{
          loading: shared.loading || shared.checkingGroups,
          refreshGroups: shared.refreshGroups,
          accessByGroup: shared.accessByGroup,
          changeAccess: shared.changeAccess,
        }}
      >
        <main className="board-page" id="board-page">
          <div className="board-page-container">
            <Board onReturnHome={markBoardReturn} />
          </div>
        </main>
      </GroupSharingContext>
    </I18nContext>
  );
}
