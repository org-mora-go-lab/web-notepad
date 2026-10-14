import { expect, test } from "@playwright/test";

import { groupMenu, groupsCommand } from "../../__util__";

test("1. 하단 그룹 선택 버튼을 누르면 버튼 위에 그룹 드롭다운이 열린다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await expect(groupMenu(page)).toBeVisible();
  const triggerBox = (await groupsCommand(page).boundingBox())!;
  const menuBox = (await groupMenu(page).boundingBox())!;
  expect(menuBox.y + menuBox.height).toBeLessThanOrEqual(triggerBox.y + 1);
});
