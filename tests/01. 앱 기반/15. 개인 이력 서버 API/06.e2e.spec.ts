import { test } from "@playwright/test";

import { runHistoryServerCase } from "../../__util__";

test("6. 필수 배열이 빠진 스냅샷을 거부한다", async ({
  request,
  page,
  context,
}) => {
  await runHistoryServerCase(6, { request, page, context });
});
