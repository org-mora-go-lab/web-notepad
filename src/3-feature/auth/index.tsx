"use client";

import { CircleUserRound, LogIn } from "lucide-react";
import { useEffect, useState } from "react";

import { useI18n } from "@/src/5-shared/hook";

type AuthUser = {
  id: string;
  nickname: string;
  profileImageUrl?: string;
};

export function Auth() {
  const { t } = useI18n();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => response.json() as Promise<{ user: AuthUser | null }>)
      .then(({ user: nextUser }) => {
        if (active) setUser(nextUser);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        setUser(null);
        window.dispatchEvent(new Event("notepad-auth-changed"));
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="auth-command is-loading" role="status" aria-label={t.accountLoading} aria-busy="true">
        <span className="auth-skeleton-avatar" aria-hidden="true" />
        <span className="auth-skeleton-name" aria-hidden="true" />
      </div>
    );
  }

  if (user) {
    return (
      <button
        className="auth-command"
        type="button"
        title={`${user.nickname} · ${t.logout}`}
        aria-label={`${user.nickname} · ${t.logout}`}
        disabled={loading}
        onClick={logout}
      >
        {user.profileImageUrl ? (
          // Kakao profile hosts are dynamic, so a plain image avoids an unsafe remote-host allowlist.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.profileImageUrl} alt="" referrerPolicy="no-referrer" />
        ) : (
          <CircleUserRound aria-hidden="true" />
        )}
        <span>{user.nickname}</span>
      </button>
    );
  }

  return (
    <a
      className="auth-command"
      href="/api/auth/oauth/kakao"
      title={t.kakaoLogin}
      aria-label={t.kakaoLogin}
      aria-disabled={loading}
      onClick={(event) => {
        if (loading) event.preventDefault();
      }}
    >
      <LogIn aria-hidden="true" />
      <span>{t.login}</span>
    </a>
  );
}
