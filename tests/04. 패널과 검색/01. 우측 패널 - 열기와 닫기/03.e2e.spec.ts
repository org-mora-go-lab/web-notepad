import { expect, test } from "@playwright/test";

import { groupMenu, groupsCommand } from "../../__util__";

test("3. 그룹 선택 버튼은 우측 패널 대신 그룹 드롭다운을 연다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();

  await expect(groupMenu(page)).toBeVisible();
  await expect(page.locator('.side-panel[aria-hidden="false"]')).toHaveCount(0);
});
