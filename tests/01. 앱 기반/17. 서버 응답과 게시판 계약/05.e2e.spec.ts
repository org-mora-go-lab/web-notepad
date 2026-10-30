import { test } from "@playwright/test";

import { runResponseServerCase } from "../../__util__";

test("5. 외부 Origin의 알림 전체 삭제를 거부한다", async ({
  request,
  page,
  context,
}) => {
  await runResponseServerCase(5, { request, page, context });
});
