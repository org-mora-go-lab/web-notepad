import { test } from "@playwright/test";

import { runSessionServerCase } from "../../__util__";

test("4. 구분자가 과도한 세션 쿠키를 거부한다", async ({
  request,
  page,
  context,
}) => {
  await runSessionServerCase(4, { request, page, context });
});
