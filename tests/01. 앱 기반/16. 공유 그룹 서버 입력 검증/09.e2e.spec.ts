import { test } from "@playwright/test";

import { runSharedInputServerCase } from "../../__util__";

test("9. shared UUID 형식이 아닌 그룹 업데이트를 거부한다", async ({
  request,
  page,
  context,
}) => {
  await runSharedInputServerCase(9, { request, page, context });
});
