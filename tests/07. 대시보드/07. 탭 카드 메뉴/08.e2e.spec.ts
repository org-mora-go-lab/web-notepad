import { test } from "@playwright/test";

import { verifyStatusMoves } from "./__util__";

test("8. Closed 카드 메뉴는 다른 네 상태로 이동한다", async ({ page }) => {
  await verifyStatusMoves(page, "closed", false);
});
