import { test } from "@playwright/test";

import { runSharedInputServerCase } from "../../__util__";

test("4. Ungrouped 그룹의 공유 생성을 거부한다", async ({
  request,
  page,
  context,
}) => {
  await runSharedInputServerCase(4, { request, page, context });
});
