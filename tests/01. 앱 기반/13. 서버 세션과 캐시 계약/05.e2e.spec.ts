import { test } from "@playwright/test";

import { runSessionServerCase } from "../../__util__";

test("5. 사용자 ID가 빈 서명 세션을 거부한다", async ({
  request,
  page,
  context,
}) => {
  await runSessionServerCase(5, { request, page, context });
});
