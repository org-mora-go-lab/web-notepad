import { expect, test } from "@playwright/test";

import { authProfile, signedSession } from "../../__fixture__";
import { sessionHeaders } from "../../__util__";

test("3. 만료된 세션은 프로필을 반환하지 않는다", async ({ request }) => {
  const response = await request.get("/api/auth/session", {
    headers: sessionHeaders(
      signedSession({ ...authProfile, expiresAt: Date.now() - 1000 }),
    ),
  });
  expect(await response.json()).toEqual({ user: null });
});
