import { test } from "@playwright/test";

import { runOAuthServerCase } from "../../__util__";

test("2. OAuth 인증 URL은 code 응답과 설정된 REST API 키를 사용한다", async ({
  request,
  page,
  context,
}) => {
  await runOAuthServerCase(2, { request, page, context });
});
