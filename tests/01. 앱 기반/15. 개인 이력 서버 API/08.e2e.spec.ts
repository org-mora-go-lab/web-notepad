import { test } from "@playwright/test";

import { runHistoryServerCase } from "../../__util__";

test("8. 5MB를 초과한 스냅샷을 저장하지 않는다", async ({
  request,
  page,
  context,
}) => {
  await runHistoryServerCase(8, { request, page, context });
});
