import { expect, test } from "@playwright/test";

import { getApi } from "../../__util__/request";

test("10. 일반 조회 요청의 임의 쿠키로 세션을 생성하지 않는다", async ({
  request,
}) => {
  const response = await getApi(request, "/api/auth/session", {
    headers: { Cookie: "nickname=Admin; userId=1" },
  });
  expect(await response.json()).toEqual({ user: null });
  expect(response.headers()["set-cookie"]).toBeUndefined();
});
