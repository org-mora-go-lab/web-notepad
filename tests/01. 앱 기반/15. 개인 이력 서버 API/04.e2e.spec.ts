import { test } from "@playwright/test";

import { runHistoryServerCase } from "../../__util__";

test("4. 깨진 JSON 개인 이력 요청을 400으로 거부한다", async ({
  request,
  page,
  context,
}) => {
  await runHistoryServerCase(4, { request, page, context });
});
