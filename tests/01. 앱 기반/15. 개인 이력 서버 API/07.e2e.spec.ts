import { test } from "@playwright/test";

import { runHistoryServerCase } from "../../__util__";

test("7. 현재 세션과 다른 userId의 저장 요청을 거부한다", async ({
  request,
  page,
  context,
}) => {
  await runHistoryServerCase(7, { request, page, context });
});
