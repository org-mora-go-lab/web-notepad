import { test } from "@playwright/test";

import { runOAuthServerCase } from "../../__util__";

test("10. state 불일치 callback은 세션을 만들지 않고 임시 쿠키를 만료한다", async ({
  request,
  page,
  context,
}) => {
  await runOAuthServerCase(10, { request, page, context });
});
