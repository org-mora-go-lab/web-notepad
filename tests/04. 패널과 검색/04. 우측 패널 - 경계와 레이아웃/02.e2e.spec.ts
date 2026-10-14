import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";

test("2. PC에서 미고정 패널의 바깥을 클릭하면 패널을 닫는다", async ({ page }) => {
  await page.goto("/");
  await openPanel(page, "bookmarks-panel");
  await page.mouse.click(5, 200);
  await expect(page.locator("#bookmarks-panel")).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator(".bookmark .side-panel-backdrop")).toHaveCSS("pointer-events", "none");
});
