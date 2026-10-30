import { test } from "@playwright/test";

import { runOAuthServerCase } from "../../__util__";

test("4. OAuth state는 32바이트 기반의 URL 안전 난수다", async ({
  request,
  page,
  context,
}) => {
  await runOAuthServerCase(4, { request, page, context });
});
