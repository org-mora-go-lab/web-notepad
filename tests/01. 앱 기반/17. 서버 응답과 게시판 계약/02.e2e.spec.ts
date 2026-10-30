import { test } from "@playwright/test";

import { runResponseServerCase } from "../../__util__";

test("2. 공유 그룹 목록은 인증 후 private no-store 배열로 반환한다", async ({
  request,
  page,
  context,
}) => {
  await runResponseServerCase(2, { request, page, context });
});
