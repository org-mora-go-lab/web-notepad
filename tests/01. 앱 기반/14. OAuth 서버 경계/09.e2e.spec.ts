import { test } from "@playwright/test";

import { runOAuthServerCase } from "../../__util__";

test("9. code 없는 callback은 로컬 invalid_state로 복귀한다", async ({
  request,
  page,
  context,
}) => {
  await runOAuthServerCase(9, { request, page, context });
});
