import { test } from "@playwright/test";

import { runSharedInputServerCase } from "../../__util__";

test("5. 공백이 포함된 잘못된 로컬 그룹 ID를 거부한다", async ({
  request,
  page,
  context,
}) => {
  await runSharedInputServerCase(5, { request, page, context });
});
