import { test } from "@playwright/test";

import { runSessionServerCase } from "../../__util__";

test("10. 로그아웃은 OAuth 상태만 지우고 무관한 쿠키는 유지한다", async ({
  request,
  page,
  context,
}) => {
  await runSessionServerCase(10, { request, page, context });
});
