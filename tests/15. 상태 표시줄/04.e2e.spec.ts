import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS, MOBILE_VIEWPORT } from "../__constant__";
import { groupsCommand, groupSelectCommand } from "../__util__";

test("4. 맨 오른쪽 그룹 선택 버튼(모바일 GROUP, PC 그룹 이름)과 모바일 그룹 이름 모두 그룹 패널을 연다", async ({ page }) => {
  await page.goto("/");
  const groupName = groupsCommand(page);
  const groupIcon = groupSelectCommand(page);
  const groupsPanel = page.locator("#groups-panel");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(groupIcon.locator("svg")).toHaveCount(1);
    const mobile = viewport === MOBILE_VIEWPORT;
    await expect(groupIcon.locator(".status-label:visible")).toHaveText(mobile ? "GROUP" : "Ungrouped");
    await expect(groupIcon).toHaveAttribute("aria-label", "그룹 선택");

    const commands = await page.locator(".status-meta .status-command:visible").all();
    const iconBox = (await groupIcon.boundingBox())!;
    for (const command of commands) {
      expect((await command.boundingBox())!.x).toBeLessThanOrEqual(iconBox.x);
    }
    if (mobile) expect((await groupName.boundingBox())!.x).toBeLessThan(iconBox.x);

    for (const command of mobile ? [groupName, groupIcon] : [groupIcon]) {
      await command.click();
      await expect(groupsPanel).toHaveAttribute("aria-hidden", "false");
      await expect(command).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("Escape");
      await expect(groupsPanel).toHaveAttribute("aria-hidden", "true");
    }
  }
});
