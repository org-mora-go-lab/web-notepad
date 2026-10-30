import { test } from "@playwright/test";

import { runHistoryServerCase } from "../../__util__";

test("3. 외부 Origin의 개인 이력 저장 요청을 거부한다", async ({
  request,
  page,
  context,
}) => {
  await runHistoryServerCase(3, { request, page, context });
});
