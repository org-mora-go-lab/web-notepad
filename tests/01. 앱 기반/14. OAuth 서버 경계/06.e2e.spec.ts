import { test } from "@playwright/test";

import { runOAuthServerCase } from "../../__util__";

test("6. OAuth state 쿠키는 HttpOnly SameSite Lax와 10분 수명을 적용한다", async ({
  request,
  page,
  context,
}) => {
  await runOAuthServerCase(6, { request, page, context });
});
