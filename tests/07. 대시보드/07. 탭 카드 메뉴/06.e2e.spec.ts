import { test } from "@playwright/test";

import { verifyStatusMoves } from "./__util__";

test("6. Note 카드 메뉴는 그룹별 상태 이름으로 다른 네 상태로 이동한다", async ({ page }) => {
  await verifyStatusMoves(page, "icebox", true);
});
