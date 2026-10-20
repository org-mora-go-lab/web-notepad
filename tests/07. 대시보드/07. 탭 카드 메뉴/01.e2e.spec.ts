import { test } from "@playwright/test";

import { verifyStatusMoves } from "./__util__";

test("1. To Do 카드 메뉴는 현재 상태를 제외한 네 상태로 이동한다", async ({ page }) => {
  await verifyStatusMoves(page, "todo", false);
});
