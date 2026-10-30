import { test } from "@playwright/test";

import { runOAuthServerCase } from "../../__util__";

test("7. 유효하지 않은 공유 토큰은 복귀 쿠키에서 제거한다", async ({
  request,
  page,
  context,
}) => {
  await runOAuthServerCase(7, { request, page, context });
});
