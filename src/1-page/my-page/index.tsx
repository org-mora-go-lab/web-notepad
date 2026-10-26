"use client";

import "./index.scss";

import { ArrowLeft, Bookmark, CircleUserRound, FileText, Layers, LogOut, Settings, Share2, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { isSharedGroupId, UNGROUPED_GROUP_ID, useCloudSave, useNotepadHydrated, useNotepadStore, useSharedGroups } from "@/src/4-entity/notepad";
import { MESSAGES } from "@/src/5-shared/constant";
import type { AccountProfile } from "@/src/5-shared/type";

export function MyPage() {
  const router = useRouter();
  const hydrated = useNotepadHydrated();
  const groups = useNotepadStore(state => state.groups);
  const settings = useNotepadStore(state => state.settings);
  const cloud = useCloudSave(hydrated);
  const shared = useSharedGroups(hydrated);
  const [user, setUser] = useState<AccountProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);
  const t = MESSAGES[settings.language];
  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { cache: "no-store" }).then(async response => {
      if (!response.ok) throw Error("Account unavailable");
      const result = await response.json() as { user: AccountProfile | null };
      if (active) { setUser(result.user); setFailed(false); if (attempt > 0) window.dispatchEvent(new Event("notepad-auth-changed")); }
    }).catch(() => { if (active) setFailed(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);
  useEffect(() => {
    document.documentElement.lang = settings.language;
    document.documentElement.style.setProperty("--font-scale", String(settings.fontScale));
  }, [settings.fontScale, settings.language]);
  const workspaceLoading = !hydrated || !cloud.serverLoaded || !shared.groupsLoaded;
  const workspaceFailed = !!user && ((!cloud.serverLoaded && cloud.ready && cloud.status === "error") || (!shared.groupsLoaded && shared.loadError));
  const pageLoading = loading || (!!user && !failed && !workspaceFailed && workspaceLoading);
  const myGroups = groups.filter(group => group.id !== UNGROUPED_GROUP_ID && (!isSharedGroupId(group.id) || shared.accessByGroup[group.id]?.role === "owner"));
  const access = Object.values(shared.accessByGroup);
  const metrics = [
    { key: "my-groups", label: t.myGroup, value: myGroups.length, Icon: Layers },
    { key: "shared-by-me", label: t.myPageSharedByMe, value: access.filter(item => item.role === "owner" && item.active).length, Icon: Share2 },
    { key: "joined", label: t.myPageJoined, value: access.filter(item => item.role === "member").length, Icon: Users },
    { key: "notes", label: t.myPageNotes, value: groups.flatMap(group => group.tabs).filter(tab => tab.content.trim()).length, Icon: FileText },
    { key: "bookmarks", label: t.myPageBookmarks, value: groups.reduce((sum, group) => sum + group.bookmarks.length, 0), Icon: Bookmark },
  ];
  const syncText = cloud.status === "pending" ? t.cloudPending : cloud.status === "saving" ? t.cloudSaving : cloud.status === "error" ? t.cloudError : cloud.status === "saved" ? t.cloudSaved : t.myPageNeverSaved;
  return <main className="my-page" aria-busy={pageLoading}>
    <div className="my-page-container">
      <header className="my-page-header"><Link href="/"><ArrowLeft size={18} />{t.myPageHome}</Link><h1>{t.myPage}</h1><p>{t.myPageIntro}</p></header>
      {pageLoading ? <div className="my-page-skeleton" role="status" aria-label={t.myPageLoading}>
          <section className="my-page-profile is-loading" aria-hidden="true"><span className="my-page-avatar-skeleton" /><span className="my-page-name-skeleton" /></section>
          <div className="my-page-metrics-skeleton" aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <span key={index} />)}</div>
          <div className="my-page-sync-skeleton" aria-hidden="true"><span /><span /><span /></div>
          <div className="my-page-actions-skeleton" aria-hidden="true"><span /><span /><span /></div>
        </div>
        : failed || workspaceFailed ? <section className="my-page-notice" role="alert"><p>{failed ? t.myPageLoadError : t.myPageWorkspaceError}</p><button type="button" onClick={() => { setLoading(true); setAttempt(value => value + 1); }}>{t.boardRetry}</button></section>
          : !user ? <section className="my-page-notice"><p>{t.myPageLoginHint}</p><a href="/api/auth/oauth/kakao">{t.kakaoLogin}</a></section> : <>
            <section className="my-page-profile">
              {user.profileImageUrl ? (
                // Kakao image hosts vary by account.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.profileImageUrl} alt="" referrerPolicy="no-referrer" />
              ) : <CircleUserRound size={64} aria-hidden="true" />}
              <div><h2>{user.nickname}</h2><p>{t.myPageKakao}</p></div>
            </section>
            <dl className="my-page-metrics">
              {metrics.map(({ key, label, value, Icon }) => <div key={key} data-metric={key}><dt><Icon size={18} />{label}</dt><dd>{value}</dd></div>)}
            </dl>
            <section className="my-page-sync" aria-label={t.myPageSync}>
              <h2>{t.myPageSync}</h2><p role="status" data-cloud-save={cloud.status ?? "idle"}>{syncText}</p>
              <dl><dt>{t.myPageLastSaved}</dt><dd>{cloud.lastSavedAt ? <time dateTime={new Date(cloud.lastSavedAt).toISOString()}>{new Date(cloud.lastSavedAt).toLocaleString(settings.language === "ko" ? "ko-KR" : "en-US")}</time> : t.myPageNeverSaved}</dd></dl>
              <p className="my-page-hint">{t.myPageLocalHint}</p>
            </section>
            <nav className="my-page-actions"><Link href="/?panel=settings"><Settings size={18} />{t.myPageSettings}</Link><Link href="/?panel=board"><Users size={18} />{t.accountBoard}</Link>
              <button type="button" disabled={loggingOut} onClick={async () => {
                setLoggingOut(true);
                try { const response = await fetch("/api/auth/logout", { method: "POST" });
                  if (response.ok) { window.dispatchEvent(new Event("notepad-auth-changed")); router.replace("/"); } else setFailed(true);
                } catch { setFailed(true); } finally { setLoggingOut(false); }
              }}><LogOut size={18} /><span>{t.logout}</span></button>
            </nav>
          </>}
    </div>
  </main>;
}
