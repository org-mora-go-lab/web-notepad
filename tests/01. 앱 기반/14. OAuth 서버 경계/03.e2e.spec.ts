import { test } from "@playwright/test";

import { runOAuthServerCase } from "../../__util__";

test("3. OAuth 인증 URL은 정확한 callback과 프로필 scope를 사용한다", async ({
  request,
  page,
  context,
}) => {
  await runOAuthServerCase(3, { request, page, context });
});
