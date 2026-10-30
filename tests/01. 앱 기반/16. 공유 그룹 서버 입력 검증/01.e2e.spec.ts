import { test } from "@playwright/test";

import { runSharedInputServerCase } from "../../__util__";

test("1. 비로그인 공유 생성 요청을 거부한다", async ({
  request,
  page,
  context,
}) => {
  await runSharedInputServerCase(1, { request, page, context });
});
