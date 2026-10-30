import { test } from "@playwright/test";

import { runResponseServerCase } from "../../__util__";

test("1. 비로그인 사용자의 공유 그룹 목록 조회를 거부한다", async ({
  request,
  page,
  context,
}) => {
  await runResponseServerCase(1, { request, page, context });
});
