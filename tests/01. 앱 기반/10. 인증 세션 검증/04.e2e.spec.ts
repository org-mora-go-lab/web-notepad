import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { sessionHeaders } from "../../__util__";

test("4. 서명 후 프로필을 변조한 세션을 거부한다", async ({ request }) => {
  const original = signedSession();
  const signature = original.split(".")[1];
  const changed = Buffer.from(
    JSON.stringify({
      id: "attacker",
      nickname: "Changed",
      expiresAt: Date.now() + 60000,
    }),
  ).toString("base64url");
  const response = await request.get("/api/auth/session", {
    headers: sessionHeaders(changed + "." + signature),
  });
  expect(await response.json()).toEqual({ user: null });
});
