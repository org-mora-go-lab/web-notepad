import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { closeActiveTabWithContent, closedCommand } from "../__util__";

test("3. CLOSED를 선택하면 드롭다운을 닫고 Closed 패널을 열며 상태 표시줄에는 CLOSED를 표시하지 않는다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "closed note");
  const command = closedCommand(page);
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(page.locator('.footer [aria-controls="closed-panel"]')).toHaveCount(0);
    await page.getByRole("button", { name: "MENU", exact: true }).click();
    await command.click();
    await expect(page.getByRole("button", { name: "MENU", exact: true })).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#closed-panel")).toHaveAttribute("aria-hidden", "false");
    await expect(page.locator(".closed-item")).toHaveCount(1);
    await page.keyboard.press("Escape");
  }
});
