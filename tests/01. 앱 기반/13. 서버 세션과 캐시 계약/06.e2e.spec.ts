import { test } from "@playwright/test";

import { runSessionServerCase } from "../../__util__";

test("6. 닉네임이 빈 서명 세션을 거부한다", async ({
  request,
  page,
  context,
}) => {
  await runSessionServerCase(6, { request, page, context });
});
