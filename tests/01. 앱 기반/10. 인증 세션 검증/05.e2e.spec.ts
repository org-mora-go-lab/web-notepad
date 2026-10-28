import { expect, test } from "@playwright/test";

import { sessionHeaders } from "../../__util__";
import { getApi } from "../../__util__/request";

test("5. 서명 구분자가 없는 세션을 안전하게 거부한다", async ({ request }) => {
  const response = await getApi(request, "/api/auth/session", {
    headers: sessionHeaders("incomplete"),
  });
  expect(response.ok()).toBe(true);
  expect(await response.json()).toEqual({ user: null });
});
