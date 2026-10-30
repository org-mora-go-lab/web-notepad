import { test } from "@playwright/test";

import { runResponseServerCase } from "../../__util__";

test("9. role admin 쿼리는 게시판 응답에 관리자 권한을 추가하지 않는다", async ({
  request,
  page,
  context,
}) => {
  await runResponseServerCase(9, { request, page, context });
});
