import { expect, test } from "@playwright/test";

import { signedSessionText } from "../../__fixture__";
import { sessionHeaders } from "../../__util__";
import { getApi } from "../../__util__/request";

test("6. 서명은 유효해도 JSON이 아닌 세션을 거부한다", async ({ request }) => {
  const response = await getApi(request, "/api/auth/session", {
    headers: sessionHeaders(signedSessionText("invalid-json")),
  });
  expect(await response.json()).toEqual({ user: null });
});
