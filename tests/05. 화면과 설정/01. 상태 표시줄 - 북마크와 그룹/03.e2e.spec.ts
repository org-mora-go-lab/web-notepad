import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { groupsCommand } from "../../__util__";

test("3. 사이드바 버튼은 SIDEBAR를 표시하고 모바일은 별도 영역에 현재 그룹 이름을 표시한다", async ({ page }) => {
  await page.goto("/");
  const command = groupsCommand(page);
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(command.locator("svg")).toHaveCount(1);
    await expect(command.locator(".status-count")).toHaveCount(0);
    await expect(page.locator(".group-status-command")).toHaveCount(0);
    await expect(command).toHaveAttribute("aria-label", "Toggle sidebar");

    if (viewport.width <= 512) {
      await expect(command).toHaveCSS("gap", "4px");
      await expect(command.locator(".group-command-label")).toHaveText("SIDEBAR");
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
      await expect(command).toHaveCSS("gap", "12px");
      await expect(command.locator(".group-select-name")).toBeVisible();
      await expect(command.locator(".group-select-name")).toHaveText("SIDEBAR");
      await expect(command.locator(".group-command-label")).toBeHidden();
      await expect(page.locator(".current-group-panel")).toBeHidden();
    }
  }
});
