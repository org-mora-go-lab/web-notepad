import { test } from "@playwright/test";

import { runHistoryServerCase } from "../../__util__";

test("10. 잘못된 기준 event ID는 최신 이력을 포함한 409를 반환한다", async ({
  request,
  page,
  context,
}) => {
  await runHistoryServerCase(10, { request, page, context });
});
