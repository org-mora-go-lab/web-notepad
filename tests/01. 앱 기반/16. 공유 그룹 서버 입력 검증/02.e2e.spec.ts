import { test } from "@playwright/test";

import { runSharedInputServerCase } from "../../__util__";

test("2. 외부 Origin의 공유 생성 요청을 거부한다", async ({
  request,
  page,
  context,
}) => {
  await runSharedInputServerCase(2, { request, page, context });
});
