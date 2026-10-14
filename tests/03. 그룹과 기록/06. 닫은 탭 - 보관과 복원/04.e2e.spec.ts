import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { closeActiveTabWithContent, closedCommand } from "../../__util__";

test("4. 상태 표시줄에는 CLOSED를 표시하지 않는다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "closed note");

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await page.getByRole("button", { name: "MENU", exact: true }).click();
    await closedCommand(page).click();
    await expect(page.locator("#closed-panel")).toHaveAttribute("aria-hidden", "false");
    await expect(page.locator('.footer [aria-controls="closed-panel"]')).toHaveCount(0);
    await page.keyboard.press("Escape");
  }
});
