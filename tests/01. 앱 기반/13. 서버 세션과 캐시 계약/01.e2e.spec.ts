import { test } from "@playwright/test";

import { runSessionServerCase } from "../../__util__";

test("1. 익명 세션 조회는 user null과 200을 반환한다", async ({
  request,
  page,
  context,
}) => {
  await runSessionServerCase(1, { request, page, context });
});
