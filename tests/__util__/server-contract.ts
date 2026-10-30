import {
  type APIRequestContext,
  type BrowserContext,
  expect,
  type Page,
} from "@playwright/test";

import { signedSession } from "../__fixture__";
import { authenticateBrowser } from "./auth";
import { getApi } from "./request";

type ServerFixtures = {
  request: APIRequestContext;
  page: Page;
  context: BrowserContext;
};

const origin = { Origin: "http://localhost:3000" };
const foreignOrigin = { Origin: "https://attacker.example" };

function sessionToken(id = `server-${crypto.randomUUID()}`) {
  return signedSession({
    id,
    nickname: "Server Tester",
    expiresAt: Date.now() + 300_000,
  });
}

async function authenticate(context: BrowserContext, id?: string) {
  await authenticateBrowser(context, sessionToken(id));
}

function snapshot(contents = ["server note"]) {
  return JSON.stringify({
    nextTabNumber: contents.length + 1,
    groups: [
      {
        id: "ungrouped",
        name: "Ungrouped",
        tabs: contents.map((content, index) => ({
          id: `tab-${index + 1}`,
          title: content,
          content,
          open: true,
        })),
        bookmarks: [],
      },
    ],
    activeGroupId: "ungrouped",
    closedTabs: [],
    settings: { language: "en", fontScale: 0.9 },
  });
}

async function historyPost(
  page: Page,
  body: Record<string, unknown>,
  headers = origin,
) {
  return page.request.post("/api/notepad/history", {
    headers,
    data: body,
  });
}

export async function runSessionServerCase(
  number: number,
  { request, page, context }: ServerFixtures,
) {
  if (number === 1) {
    const response = await getApi(request, "/api/auth/session");
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ user: null });
    return;
  }
  if (number === 2) {
    await authenticate(context);
    const response = await getApi(page.request, "/api/auth/session");
    expect(response.headers()["cache-control"]).toBe("private, no-store");
    return;
  }
  if (number === 3) {
    await authenticate(context, "session-safe");
    const user = (
      await (await getApi(page.request, "/api/auth/session")).json()
    ).user;
    expect(user).toEqual({
      id: "session-safe",
      nickname: "Server Tester",
    });
    expect(user).not.toHaveProperty("expiresAt");
    return;
  }
  if (number === 4) {
    await context.addCookies([
      {
        name: "web-notepad-session",
        value: `${sessionToken("extra-segment")}.extra`,
        url: "http://localhost:3000",
      },
    ]);
    expect(
      await (await getApi(page.request, "/api/auth/session")).json(),
    ).toEqual({
      user: null,
    });
    return;
  }
  if (number === 5 || number === 6) {
    await authenticateBrowser(
      context,
      signedSession({
        id: number === 5 ? "" : "valid-id",
        nickname: number === 6 ? "" : "Valid",
        expiresAt: Date.now() + 300_000,
      }),
    );
    expect(
      await (await getApi(page.request, "/api/auth/session")).json(),
    ).toEqual({
      user: null,
    });
    return;
  }
  if (number === 7) {
    await authenticate(context, "query-role-user");
    const body = await (
      await getApi(page.request, "/api/auth/session?role=admin")
    ).json();
    expect(body.user.id).toBe("query-role-user");
    expect(body.user).not.toHaveProperty("role");
    return;
  }
  if (number === 8) {
    await authenticate(context);
    const response = await page.request.post("/api/auth/logout");
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(
      await (await getApi(page.request, "/api/auth/session")).json(),
    ).toEqual({
      user: null,
    });
    return;
  }
  if (number === 9) {
    await authenticate(context);
    const response = await page.request.post("/api/auth/logout");
    const cookie = response.headers()["set-cookie"];
    expect(cookie).toContain("web-notepad-session=");
    expect(cookie.toLowerCase()).toContain("httponly");
    expect(cookie.toLowerCase()).toContain("samesite=lax");
    expect(cookie).toContain("Max-Age=0");
    return;
  }
  await context.addCookies([
    { name: "unrelated", value: "keep", url: "http://localhost:3000" },
    {
      name: "web-notepad-kakao-state",
      value: "pending",
      url: "http://localhost:3000",
    },
  ]);
  await page.request.post("/api/auth/logout");
  const cookies = await context.cookies("http://localhost:3000");
  expect(cookies.find((cookie) => cookie.name === "unrelated")?.value).toBe(
    "keep",
  );
  expect(
    cookies.some((cookie) => cookie.name === "web-notepad-kakao-state"),
  ).toBe(false);
}

async function oauthStart(request: APIRequestContext, path = "") {
  return getApi(request, `/api/auth/oauth/kakao${path}`, { maxRedirects: 0 });
}

export async function runOAuthServerCase(
  number: number,
  { request, page, context }: ServerFixtures,
) {
  if (number <= 6) {
    const response = await oauthStart(request);
    const location = new URL(response.headers().location);
    if (number === 1) {
      expect(response.status()).toBe(307);
      expect(location.origin + location.pathname).toBe(
        "https://kauth.kakao.com/oauth/authorize",
      );
    } else if (number === 2) {
      expect(location.searchParams.get("response_type")).toBe("code");
      expect(location.searchParams.get("client_id")).toBe("test-rest-key");
    } else if (number === 3) {
      expect(location.searchParams.get("redirect_uri")).toBe(
        "http://localhost:3000/api/auth/oauth/kakao/callback",
      );
      expect(location.searchParams.get("scope")).toBe(
        "profile_nickname,profile_image",
      );
    } else if (number === 4) {
      expect(location.searchParams.get("state")).toMatch(/^[\w-]{43}$/);
    } else if (number === 5) {
      const next = new URL(
        (await oauthStart(request)).headers().location,
      ).searchParams.get("state");
      expect(next).not.toBe(location.searchParams.get("state"));
    } else {
      const cookie = response.headers()["set-cookie"].toLowerCase();
      expect(cookie).toContain("web-notepad-kakao-state=");
      expect(cookie).toContain("httponly");
      expect(cookie).toContain("samesite=lax");
      expect(cookie).toContain("max-age=600");
    }
    return;
  }
  if (number === 7) {
    const response = await oauthStart(request, "?share=invalid.token");
    expect(response.headers()["set-cookie"]).toContain(
      "web-notepad-share-return=",
    );
    return;
  }
  if (number === 8) {
    const response = await oauthStart(
      request,
      "?return=https%3A%2F%2Fevil.example",
    );
    expect(new URL(response.headers().location).hostname).toBe(
      "kauth.kakao.com",
    );
    return;
  }
  if (number === 9) {
    const response = await getApi(
      request,
      "/api/auth/oauth/kakao/callback?state=missing",
      { maxRedirects: 0 },
    );
    const location = new URL(response.headers().location);
    expect(location.origin).toBe("http://localhost:3000");
    expect(location.searchParams.get("auth_error")).toBe("invalid_state");
    return;
  }
  await context.addCookies([
    {
      name: "web-notepad-kakao-state",
      value: "expected",
      url: "http://localhost:3000",
    },
    {
      name: "web-notepad-share-return",
      value: "invalid.token",
      url: "http://localhost:3000",
    },
  ]);
  const response = await getApi(
    page.request,
    "/api/auth/oauth/kakao/callback?code=fake&state=wrong",
    { maxRedirects: 0 },
  );
  expect(response.headers()["set-cookie"]).toContain(
    "web-notepad-kakao-state=",
  );
  expect(
    await (await getApi(page.request, "/api/auth/session")).json(),
  ).toEqual({
    user: null,
  });
}

export async function runHistoryServerCase(
  number: number,
  { request, page, context }: ServerFixtures,
) {
  if (number === 1) {
    expect((await getApi(request, "/api/notepad/history")).status()).toBe(401);
    return;
  }
  if (number === 2) {
    expect(
      (
        await request.post("/api/notepad/history", {
          data: { eventId: crypto.randomUUID(), snapshot: snapshot() },
        })
      ).status(),
    ).toBe(401);
    return;
  }
  await authenticate(context);
  if (number === 3) {
    expect(
      (
        await historyPost(
          page,
          { eventId: crypto.randomUUID(), snapshot: snapshot() },
          foreignOrigin,
        )
      ).status(),
    ).toBe(403);
    return;
  }
  if (number === 4) {
    const response = await page.request.post("/api/notepad/history", {
      headers: { ...origin, "Content-Type": "application/json" },
      data: "{",
    });
    expect(response.status()).toBe(400);
    return;
  }
  if (number === 5) {
    expect(
      (
        await historyPost(page, {
          eventId: "not-a-uuid",
          snapshot: snapshot(),
        })
      ).status(),
    ).toBe(400);
    return;
  }
  if (number === 6) {
    expect(
      (
        await historyPost(page, {
          eventId: crypto.randomUUID(),
          snapshot: JSON.stringify({ groups: [], settings: {} }),
        })
      ).status(),
    ).toBe(400);
    return;
  }
  if (number === 7) {
    expect(
      (
        await historyPost(page, {
          eventId: crypto.randomUUID(),
          snapshot: snapshot(),
          userId: "another-user",
        })
      ).status(),
    ).toBe(403);
    return;
  }
  if (number === 8) {
    const response = await historyPost(page, {
      eventId: crypto.randomUUID(),
      snapshot: "x".repeat(5_000_001),
    });
    expect(response.status()).toBe(400);
    return;
  }
  if (number === 9) {
    const eventId = crypto.randomUUID();
    expect(
      (
        await historyPost(page, { eventId, snapshot: snapshot(["a", "abc"]) })
      ).ok(),
    ).toBe(true);
    const latest = (
      await (await getApi(page.request, "/api/notepad/history")).json()
    ).latest;
    const contents = JSON.parse(latest.snapshot).groups[0].tabs.map(
      (tab: { content: string }) => tab.content,
    );
    expect(contents).toEqual(["abc"]);
    return;
  }
  const first = crypto.randomUUID();
  await historyPost(page, { eventId: first, snapshot: snapshot(["first"]) });
  const conflict = await historyPost(page, {
    eventId: crypto.randomUUID(),
    snapshot: snapshot(["second"]),
    baseEventId: crypto.randomUUID(),
  });
  expect(conflict.status()).toBe(409);
  expect((await conflict.json()).latest.eventId).toBe(first);
}

const invalidGroupBase = {
  group: {
    id: "local-group",
    name: "Server Group",
    tabs: [{ id: "tab-1", content: "valid content" }],
    bookmarks: [],
  },
};

export async function runSharedInputServerCase(
  number: number,
  { request, page, context }: ServerFixtures,
) {
  if (number === 1) {
    expect(
      (
        await request.post("/api/groups/share", {
          headers: origin,
          data: invalidGroupBase,
        })
      ).status(),
    ).toBe(401);
    return;
  }
  await authenticate(context);
  if (number === 2) {
    expect(
      (
        await page.request.post("/api/groups/share", {
          headers: foreignOrigin,
          data: invalidGroupBase,
        })
      ).status(),
    ).toBe(403);
    return;
  }
  if (number === 3) {
    const response = await page.request.post("/api/groups/share", {
      headers: { ...origin, "Content-Type": "application/json" },
      data: "{",
    });
    expect(response.status()).toBe(400);
    return;
  }
  if (number >= 4 && number <= 7) {
    const group = structuredClone(invalidGroupBase.group);
    if (number === 4) group.id = "ungrouped";
    if (number === 5) group.id = "invalid group id";
    if (number === 6) group.name = "x".repeat(61);
    if (number === 7)
      (group.tabs[0] as { content?: string }).content = undefined;
    expect(
      (
        await page.request.post("/api/groups/share", {
          headers: origin,
          data: { group },
        })
      ).status(),
    ).toBe(400);
    return;
  }
  if (number === 8) {
    expect(
      (
        await page.request.post("/api/groups/join", {
          headers: origin,
          data: { token: "invalid.token" },
        })
      ).status(),
    ).toBe(400);
    return;
  }
  if (number === 9) {
    expect(
      (
        await page.request.post("/api/groups/update", {
          headers: origin,
          data: { id: "local", baseRevision: 0, data: {} },
        })
      ).status(),
    ).toBe(400);
    return;
  }
  expect(
    (
      await page.request.post("/api/groups/leave", {
        headers: origin,
        data: { id: "shared-invalid" },
      })
    ).status(),
  ).toBe(400);
}

export async function runResponseServerCase(
  number: number,
  { request, page, context }: ServerFixtures,
) {
  if (number === 1) {
    expect((await getApi(request, "/api/groups")).status()).toBe(401);
    return;
  }
  if (number === 2) {
    await authenticate(context);
    const response = await getApi(page.request, "/api/groups");
    expect(response.status()).toBe(200);
    expect(response.headers()["cache-control"]).toBe("private, no-store");
    expect(Array.isArray((await response.json()).groups)).toBe(true);
    return;
  }
  if (number === 3) {
    expect((await getApi(request, "/api/groups/notifications")).status()).toBe(
      401,
    );
    return;
  }
  await authenticate(context);
  if (number === 4) {
    const response = await getApi(page.request, "/api/groups/notifications");
    expect(response.headers()["cache-control"]).toBe("private, no-store");
    expect(Array.isArray((await response.json()).notifications)).toBe(true);
    return;
  }
  if (number === 5) {
    expect(
      (
        await page.request.delete("/api/groups/notifications", {
          headers: foreignOrigin,
        })
      ).status(),
    ).toBe(403);
    return;
  }
  if (number === 6) {
    const response = await page.request.post("/api/groups/notifications/read", {
      headers: { ...origin, "Content-Type": "application/json" },
      data: "{",
    });
    expect(response.status()).toBe(400);
    return;
  }
  if (number === 7) {
    const response = await page.request.post("/api/groups/notifications/read", {
      headers: origin,
      data: { id: 0 },
    });
    expect(response.status()).toBe(400);
    return;
  }
  if (number === 8) {
    const response = await getApi(request, "/api/board");
    expect(response.status()).toBe(200);
    expect(response.headers()["cache-control"]).toBe("no-store");
    expect(Array.isArray((await response.json()).posts)).toBe(true);
    return;
  }
  if (number === 9) {
    const response = await getApi(page.request, "/api/board?role=admin");
    const posts = (await response.json()).posts as Record<string, unknown>[];
    expect(posts.every((post) => !("admin" in post))).toBe(true);
    return;
  }
  expect((await request.post("/api/board")).status()).toBe(405);
}
