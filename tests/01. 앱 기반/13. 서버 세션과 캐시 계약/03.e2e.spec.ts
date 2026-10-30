import { test } from "@playwright/test";

import { runSessionServerCase } from "../../__util__";

test("3. 유효한 세션은 만료 시각 없이 최소 프로필만 반환한다", async ({
  request,
  page,
  context,
}) => {
  await runSessionServerCase(3, { request, page, context });
});
