import { test } from "@playwright/test";

import { runOAuthServerCase } from "../../__util__";

test("5. OAuth를 다시 시작하면 이전과 다른 state를 발급한다", async ({
  request,
  page,
  context,
}) => {
  await runOAuthServerCase(5, { request, page, context });
});
