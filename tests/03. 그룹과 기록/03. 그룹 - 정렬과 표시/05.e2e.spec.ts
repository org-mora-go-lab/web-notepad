import { expect, test } from "@playwright/test";

import { groupsCommand } from "../../__util__";

test("5. 그룹 패널에는 Closed 팝업 진입점을 표시하지 않는다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();

  await expect(page.locator('#groups-menu button[aria-controls="closed-popup"]')).toHaveCount(0);
});
