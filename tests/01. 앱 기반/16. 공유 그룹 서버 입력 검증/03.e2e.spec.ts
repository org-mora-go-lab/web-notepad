import { test } from "@playwright/test";

import { runSharedInputServerCase } from "../../__util__";

test("3. 깨진 JSON 공유 생성 요청을 400으로 거부한다", async ({
  request,
  page,
  context,
}) => {
  await runSharedInputServerCase(3, { request, page, context });
});
