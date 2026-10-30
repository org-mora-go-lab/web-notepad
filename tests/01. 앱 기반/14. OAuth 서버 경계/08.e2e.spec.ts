import { test } from "@playwright/test";

import { runOAuthServerCase } from "../../__util__";

test("8. 외부 return 쿼리는 OAuth 리다이렉트 목적지를 바꾸지 못한다", async ({
  request,
  page,
  context,
}) => {
  await runOAuthServerCase(8, { request, page, context });
});
