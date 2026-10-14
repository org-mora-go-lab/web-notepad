import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { groupsCommand, groupSelectCommand } from "../../__util__";

test("4. 맨 왼쪽 그룹 선택 버튼은 아이콘과 그룹 이름을 표시하고 그룹 드롭다운을 연다", async ({ page }) => {
  await page.goto("/");
  const groupName = groupsCommand(page);
  const groupIcon = groupSelectCommand(page);
  const groupsMenu = page.locator("#groups-menu");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(groupIcon.locator("svg")).toHaveCount(1);
    await expect(groupIcon.locator(".status-label")).toHaveText("Ungrouped");
    await expect(groupIcon).toHaveAttribute("aria-label", "그룹 선택: Ungrouped");

    const commands = await page.locator(".status-meta .status-command:visible").all();
    const iconBox = (await groupIcon.boundingBox())!;
    for (const command of commands) {
      expect((await command.boundingBox())!.x).toBeGreaterThanOrEqual(iconBox.x);
    }

    for (const command of [groupName]) {
      await command.click();
      await expect(groupsMenu).toBeVisible();
      await expect(command).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("Escape");
      await expect(groupsMenu).toHaveCount(0);
    }
  }
});
