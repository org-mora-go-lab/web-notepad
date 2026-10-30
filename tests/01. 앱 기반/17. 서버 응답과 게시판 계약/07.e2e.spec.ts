import { test } from "@playwright/test";

import { runResponseServerCase } from "../../__util__";

test("7. 0 이하의 알림 ID를 읽음 처리하지 않는다", async ({
  request,
  page,
  context,
}) => {
  await runResponseServerCase(7, { request, page, context });
});
