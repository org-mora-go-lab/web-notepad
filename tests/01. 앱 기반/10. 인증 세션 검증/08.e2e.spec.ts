import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { sessionHeaders } from "../../__util__";

test("8. 닉네임이 없는 서명 세션을 거부한다", async ({ request }) => {
  const response = await request.get("/api/auth/session", {
    headers: sessionHeaders(
      signedSession({ id: "missing-name", expiresAt: Date.now() + 60000 }),
    ),
  });
  expect(await response.json()).toEqual({ user: null });
});
