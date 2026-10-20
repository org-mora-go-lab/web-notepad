import { expect, test } from "@playwright/test";

import { authProfile } from "../../__fixture__";
import { sessionHeaders } from "../../__util__";

test("2. 유효한 서명 세션은 프로필을 반환하고 만료 시각은 노출하지 않는다", async ({
  request,
}) => {
  const response = await request.get("/api/auth/session", {
    headers: sessionHeaders(),
  });
  expect(await response.json()).toEqual({ user: authProfile });
});
