import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { openPanel } from "../__util__";

test("14. 우측 패널을 열어도 배경을 어둡게 하지 않고 투명하게 유지한다", async ({ page }) => {
  await page.goto("/");
  const panel = page.locator("#bookmarks-panel");
  const backdrop = page.locator(".bookmark .side-panel-backdrop");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await openPanel(page, "bookmarks-panel");
    await expect(backdrop).toHaveClass(/is-visible/);
    await expect(backdrop).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(backdrop).toHaveCSS("opacity", "1");
    await panel.locator(".side-panel-close").click();
    await expect(panel).toHaveAttribute("aria-hidden", "true");
  }
});
