import { expect, test } from "@playwright/test";

import { groupMenu, groupsCommand } from "../../__util__";

test("5. 그룹 드롭다운의 바깥 영역을 클릭하면 닫는다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await page.locator(".note-area").click();

  await expect(groupMenu(page)).toHaveCount(0);
});
