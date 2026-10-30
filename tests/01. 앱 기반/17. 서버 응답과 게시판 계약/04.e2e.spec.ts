import { test } from "@playwright/test";

import { runResponseServerCase } from "../../__util__";

test("4. 알림 목록은 private no-store 배열로 반환한다", async ({
  request,
  page,
  context,
}) => {
  await runResponseServerCase(4, { request, page, context });
});
