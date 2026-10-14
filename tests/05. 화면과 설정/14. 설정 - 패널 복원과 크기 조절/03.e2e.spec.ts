import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";

test("3. Panel Slide가 Off이면 모든 사이드 패널을 전환 시간 없이 열고 닫는다", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  await expect(page.locator(".home")).toHaveAttribute("data-panel-slide", "off");
  for (const id of [
    "bookmarks-panel",
    "dashboard-panel",
    "closed-panel",
    "global-search-panel",
    "shortcuts-panel",
  ]) {
    await openPanel(page, id);
    const panel = page.locator(`#${id}`);
    await expect(panel).toHaveCSS("transition-duration", "0s");
    await page.keyboard.press("Escape");
    await expect(panel).toHaveAttribute("aria-hidden", "true");
  }
});
