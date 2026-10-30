import { test } from "@playwright/test";

import { runSharedInputServerCase } from "../../__util__";

test("7. 본문 문자열이 없는 공유 탭을 거부한다", async ({
  request,
  page,
  context,
}) => {
  await runSharedInputServerCase(7, { request, page, context });
});
