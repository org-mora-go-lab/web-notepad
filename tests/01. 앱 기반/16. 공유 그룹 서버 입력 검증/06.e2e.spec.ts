import { test } from "@playwright/test";

import { runSharedInputServerCase } from "../../__util__";

test("6. 60자를 초과한 공유 그룹 이름을 거부한다", async ({
  request,
  page,
  context,
}) => {
  await runSharedInputServerCase(6, { request, page, context });
});
