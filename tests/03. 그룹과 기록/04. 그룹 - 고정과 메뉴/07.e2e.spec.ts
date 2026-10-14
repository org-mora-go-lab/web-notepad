import { expect, test } from "@playwright/test";

import { groupMenu, groupsCommand } from "../../__util__";

test("7. 열린 그룹 드롭다운의 그룹 선택 버튼을 다시 누르면 닫는다", async ({ page }) => {
  await page.goto("/");
  const trigger = groupsCommand(page);
  await trigger.click();
  await trigger.click();

  await expect(groupMenu(page)).toHaveCount(0);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});
