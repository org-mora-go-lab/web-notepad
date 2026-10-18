import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { groupsCommand } from "../../__util__";

test("3. 하단 그룹 버튼은 PC에서 그룹명을 함께 표시하고 모바일은 아이콘과 GROUP을 표시한다", async ({ page }) => {
  await page.goto("/");
  const command = groupsCommand(page);
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(command.locator("svg")).toHaveCount(1);
    await expect(command.locator(".status-count")).toHaveCount(0);
    await expect(page.locator(".group-status-command")).toHaveCount(0);
    await expect(command).toHaveAttribute("aria-label", "Toggle groups");

    if (viewport.width <= 512) {
      await expect(command).toHaveCSS("gap", "4px");
      await expect(command.locator(".group-command-label")).toHaveText("GROUP");
      await expect(command.locator(".group-select-name")).toBeHidden();
      await expect(page.locator(".current-group-panel")).toBeVisible();
      await expect(page.locator(".current-group-name")).toHaveText("Ungrouped");
      const icon = page.locator(".current-group-icon");
      await expect(icon).toBeVisible();
      await expect(icon).toHaveClass(/lucide-layers/);
      const iconBox = (await icon.boundingBox())!;
      const nameBox = (await page.locator(".current-group-name").boundingBox())!;
      expect(nameBox.x - iconBox.x - iconBox.width).toBeCloseTo(7, 0);
    } else {
      await expect(command).toHaveCSS("gap", "7px");
      await expect(command.locator(".group-select-name")).toBeVisible();
      await expect(command.locator(".group-select-name")).toHaveText("GROUP");
      await expect(command.locator(".group-current-value")).toHaveText("Ungrouped");
      await expect(command.locator(".group-command-label")).toBeHidden();
      await expect(page.locator(".current-group-panel")).toBeHidden();
    }
  }
});
