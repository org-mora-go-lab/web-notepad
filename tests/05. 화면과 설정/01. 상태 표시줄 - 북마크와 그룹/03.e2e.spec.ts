import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { groupsCommand } from "../../__util__";

test("3. 그룹 버튼은 PC와 모바일에서 아이콘과 현재 그룹명을 표시한다", async ({
  page,
}) => {
  await page.goto("/");
  const command = groupsCommand(page);
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(command.locator("svg")).toHaveCount(1);
    await expect(command.locator(".status-count")).toHaveCount(0);
    await expect(page.locator(".group-status-command")).toHaveCount(0);
    await expect(command).toHaveAttribute("aria-label", "Toggle groups");
    const groupBox = (await command.boundingBox())!;
    const dashboardBox = (await page
      .locator(".dashboard-command")
      .boundingBox())!;
    if (viewport.width <= 512)
      expect(groupBox.x).toBeGreaterThan(dashboardBox.x);
    else expect(groupBox.x).toBeLessThan(dashboardBox.x);

    if (viewport.width <= 512) {
      await expect(command).toHaveCSS("gap", "4px");
      await expect(command.locator(".group-command-label")).toBeHidden();
      await expect(command.locator(".group-current-value")).toHaveText(
        "Ungrouped",
      );
      await expect(command.locator(".group-current-value")).toBeVisible();
      await expect(page.locator(".current-group-panel")).toHaveCount(0);
    } else {
      await expect(command).toHaveCSS("gap", "7px");
      await expect(command.locator(".group-current-value")).toHaveText(
        "Ungrouped",
      );
      await expect(command.locator(".group-command-label")).toBeHidden();
      await expect(page.locator(".current-group-panel")).toHaveCount(0);
    }
  }
});
