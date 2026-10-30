import { test } from "@playwright/test";

import { runResponseServerCase } from "../../__util__";

test("6. 깨진 JSON 알림 읽음 요청을 거부한다", async ({
  request,
  page,
  context,
}) => {
  await runResponseServerCase(6, { request, page, context });
});
