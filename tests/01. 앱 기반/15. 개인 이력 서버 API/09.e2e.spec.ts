import { test } from "@playwright/test";

import { runHistoryServerCase } from "../../__util__";

test("9. 개인 이력 서버는 2자 이하 탭을 제거하고 3자 탭만 보존한다", async ({
  request,
  page,
  context,
}) => {
  await runHistoryServerCase(9, { request, page, context });
});
