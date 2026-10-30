import { test } from "@playwright/test";

import { runSessionServerCase } from "../../__util__";

test("7. role 쿼리로 세션 권한을 추가할 수 없다", async ({
  request,
  page,
  context,
}) => {
  await runSessionServerCase(7, { request, page, context });
});
