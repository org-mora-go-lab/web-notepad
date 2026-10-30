import { test } from "@playwright/test";

import { runResponseServerCase } from "../../__util__";

test("3. 비로그인 사용자의 알림 목록 조회를 거부한다", async ({
  request,
  page,
  context,
}) => {
  await runResponseServerCase(3, { request, page, context });
});
