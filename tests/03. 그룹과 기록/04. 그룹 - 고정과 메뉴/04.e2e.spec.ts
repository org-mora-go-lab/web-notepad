import { expect, test } from "@playwright/test";

import { groupMenu, groupsCommand } from "../../__util__";

test("4. Escape로 그룹 드롭다운을 닫으면 그룹 선택 버튼에 포커스를 복원한다", async ({ page }) => {
  await page.goto("/");
  const trigger = groupsCommand(page);
  await trigger.click();
  await page.keyboard.press("Escape");

  await expect(groupMenu(page)).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});
