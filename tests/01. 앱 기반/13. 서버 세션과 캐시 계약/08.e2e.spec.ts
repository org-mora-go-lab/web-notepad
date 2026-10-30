import { test } from "@playwright/test";

import { runSessionServerCase } from "../../__util__";

test("8. 로그아웃은 성공 JSON을 반환하고 세션을 무효화한다", async ({
  request,
  page,
  context,
}) => {
  await runSessionServerCase(8, { request, page, context });
});
