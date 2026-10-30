import { test } from "@playwright/test";

import { runResponseServerCase } from "../../__util__";

test("8. 익명 게시판 조회는 no-store posts 배열을 반환한다", async ({
  request,
  page,
  context,
}) => {
  await runResponseServerCase(8, { request, page, context });
});
