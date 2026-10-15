import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { groupsCommand, groupStatusName } from "../../__util__";

test("3. 모바일 그룹 버튼은 GROUP을 표시하고 별도 영역에 현재 그룹 이름을 표시한다", async ({ page }) => {
  await page.goto("/");
  const command = groupsCommand(page);
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(command.locator("svg")).toHaveCount(1);
    await expect(command.locator(".status-count")).toHaveCount(0);
    await expect(groupStatusName(page)).toHaveText("Ungrouped");
    await expect(groupStatusName(page)).toBeVisible();
    await expect(page.locator(".group-status-command")).toHaveCount(0);
    await expect(command).toHaveAttribute("aria-label", "Select group: Ungrouped");

    if (viewport.width <= 512) {
      await expect(command).toHaveCSS("gap", "4px");
      await expect(command.locator(".group-command-label")).toHaveText("GROUP");
      await expect(command.locator(".group-select-name")).toBeHidden();
      await expect(page.locator(".current-group-panel")).toBeVisible();
    } else {
      await expect(command).toHaveCSS("gap", "12px");
      await expect(command.locator(".group-select-name")).toBeVisible();
      await expect(command.locator(".group-command-label")).toBeHidden();
      await expect(page.locator(".current-group-panel")).toBeHidden();
    }
  }
});
