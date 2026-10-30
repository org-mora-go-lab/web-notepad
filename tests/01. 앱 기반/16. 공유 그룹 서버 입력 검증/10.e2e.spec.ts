import { test } from "@playwright/test";

import { runSharedInputServerCase } from "../../__util__";

test("10. shared UUID 형식이 아닌 그룹 나가기 요청을 거부한다", async ({
  request,
  page,
  context,
}) => {
  await runSharedInputServerCase(10, { request, page, context });
});
