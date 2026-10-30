import { test } from "@playwright/test";

import { runSessionServerCase } from "../../__util__";

test("2. 세션 응답은 private no-store 캐시 정책을 적용한다", async ({
  request,
  page,
  context,
}) => {
  await runSessionServerCase(2, { request, page, context });
});
