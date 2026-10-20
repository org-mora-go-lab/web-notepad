import type { BrowserContext } from "@playwright/test";

import { SESSION_COOKIE, signedSession } from "../../__fixture__";

export const sessionHeaders = (token = signedSession()) => ({
  Cookie: `${SESSION_COOKIE}=${token}`,
});

export async function authenticateBrowser(
  context: BrowserContext,
  token = signedSession(),
) {
  await context.addCookies([
    { name: SESSION_COOKIE, value: token, url: "http://localhost:3100" },
  ]);
}
