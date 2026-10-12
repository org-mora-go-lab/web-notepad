import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { groupsCommand, groupSelectCommand } from "../__util__";

test("2. 왼쪽 그룹명은 아이콘 없이 표시하고 맨 오른쪽 그룹 선택 아이콘과 함께 그룹 패널을 연다", async ({ page }) => {
  await page.goto("/");
  const groupName = groupsCommand(page);
  const groupIcon = groupSelectCommand(page);
  const groupsPanel = page.locator("#groups-panel");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(groupName.locator("svg")).toHaveCount(0);
    await expect(groupName.locator(".status-count")).toHaveCount(0);
    await expect(groupName.locator(".group-status-name")).toHaveText("Ungrouped");
    await expect(groupName.locator(".group-status-name")).toBeVisible();
    await expect(groupName).toHaveAttribute("aria-label", "그룹 선택: Ungrouped");
    await expect(groupIcon.locator("svg")).toHaveCount(1);
    await expect(groupIcon.locator(".status-label")).toHaveText("GROUP");
    await expect(groupIcon).toHaveAttribute("aria-label", "그룹 선택");
    await expect(page.locator(".current-group-panel")).toHaveCount(0);

    const commands = await page.locator(".status-meta .status-command:visible").all();
    const iconBox = (await groupIcon.boundingBox())!;
    for (const command of commands) {
      expect((await command.boundingBox())!.x).toBeLessThanOrEqual(iconBox.x);
    }
    expect((await groupName.boundingBox())!.x).toBeLessThan(iconBox.x);

    for (const command of [groupName, groupIcon]) {
      await command.click();
      await expect(groupsPanel).toHaveAttribute("aria-hidden", "false");
      await expect(command).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("Escape");
      await expect(groupsPanel).toHaveAttribute("aria-hidden", "true");
    }
  }
});
