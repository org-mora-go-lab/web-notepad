import { test } from "@playwright/test";

import { runHistoryServerCase } from "../../__util__";

test("1. 비로그인 사용자는 개인 이력을 조회할 수 없다", async ({
  request,
  page,
  context,
}) => {
  await runHistoryServerCase(1, { request, page, context });
});
