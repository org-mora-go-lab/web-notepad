import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { groupsCommand } from "../../__util__";

test("3. 메뉴 버튼은 PC에서 MENU, 모바일에서 현재 그룹명을 표시한다", async ({
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
    expect(groupBox.x).toBeLessThan(dashboardBox.x);

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
      await expect(command.locator(".group-current-value")).toBeHidden();
      await expect(command.locator(".group-command-label")).toHaveText("MENU");
      await expect(command.locator(".group-command-label")).toBeVisible();
      await expect(page.locator(".current-group-panel")).toHaveCount(0);
    }
  }
});
