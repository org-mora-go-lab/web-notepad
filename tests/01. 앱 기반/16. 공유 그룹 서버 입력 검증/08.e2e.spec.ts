import { test } from "@playwright/test";

import { runSharedInputServerCase } from "../../__util__";

test("8. 서명이 잘못된 공유 참여 토큰을 거부한다", async ({
  request,
  page,
  context,
}) => {
  await runSharedInputServerCase(8, { request, page, context });
});
