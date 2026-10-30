import { test } from "@playwright/test";

import { runSessionServerCase } from "../../__util__";

test("9. 로그아웃 세션 쿠키는 HttpOnly SameSite Lax와 즉시 만료를 사용한다", async ({
  request,
  page,
  context,
}) => {
  await runSessionServerCase(9, { request, page, context });
});
