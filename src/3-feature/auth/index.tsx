"use client";

import { CircleUserRound, LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

import { useI18n } from "@/src/5-shared/hook";

type AuthUser = {
  id: string;
  nickname: string;
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
      if (response.ok) setUser(null);
    } finally {
      setLoading(false);
    }
  };

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
        <CircleUserRound aria-hidden="true" />
        <LogOut className="auth-command-action" aria-hidden="true" />
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
    </a>
  );
}
