import { test } from "@playwright/test";

import { runHistoryServerCase } from "../../__util__";

test("2. 비로그인 사용자는 개인 이력을 저장할 수 없다", async ({
  request,
  page,
  context,
}) => {
  await runHistoryServerCase(2, { request, page, context });
});
