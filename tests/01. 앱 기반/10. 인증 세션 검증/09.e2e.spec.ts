import { expect, test } from "@playwright/test";

import { sessionHeaders } from "../../__util__";

test("9. 로그인 프로필 응답은 공유 캐시와 브라우저 저장을 금지한다", async ({
  request,
}) => {
  const response = await request.get("/api/auth/session", {
    headers: sessionHeaders(),
  });
  expect(response.headers()["cache-control"]).toMatch(/private/);
  expect(response.headers()["cache-control"]).toMatch(/no-store/);
});
