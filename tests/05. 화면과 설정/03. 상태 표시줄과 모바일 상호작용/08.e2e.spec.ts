import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";

test("8. PC는 실제 아이콘에 hover했을 때만 pointer 커서를 표시한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");

  const more = page.locator(".more-command");
  const label = more.locator(".status-label");
  const icon = more.locator("svg");

  await label.hover();
  await expect(more).toHaveCSS("cursor", "default");
  await expect(label).toHaveCSS("cursor", "default");

  await icon.hover();
  await expect(icon).toHaveCSS("cursor", "pointer");
  await page.locator(".group-select-command").click();
  await expect(page.locator(".group-menu-resizer")).toHaveCSS("cursor", "col-resize");
});
