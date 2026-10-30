import { test } from "@playwright/test";

import { runHistoryServerCase } from "../../__util__";

test("5. UUID가 아닌 이력 event ID를 거부한다", async ({
  request,
  page,
  context,
}) => {
  await runHistoryServerCase(5, { request, page, context });
});
