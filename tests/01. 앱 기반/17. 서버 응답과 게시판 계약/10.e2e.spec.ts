import { test } from "@playwright/test";

import { runResponseServerCase } from "../../__util__";

test("10. 게시판은 지원하지 않는 POST 메서드를 405로 거부한다", async ({
  request,
  page,
  context,
}) => {
  await runResponseServerCase(10, { request, page, context });
});
