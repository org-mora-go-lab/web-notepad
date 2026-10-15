import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";
import { expectCssPx } from "../../__util__";

test("4. 모바일 우측 패널의 아이콘·글자는 PC 크기의 1.2배로 표시한다", async ({ page }) => {
  await page.goto("/");
  for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
    await page.setViewportSize(viewport);
    const mobile = viewport.width <= 640;
    await page.getByRole("button", { name: "MENU", exact: true }).click();
    await page.locator(".global-search-command").click();
    const panel = page.locator("#global-search-panel");
    await expect(panel).toHaveAttribute("aria-hidden", "false");
    await expectCssPx(panel.locator(".search-field svg"), "width", mobile ? 18 : 15);
    await expect(panel.locator(".global-search-empty-state p")).toHaveCSS(
      "font-size",
      mobile ? "19.2px" : "16px",
    );
    await page.keyboard.press("Escape");
    await expect(panel).toHaveAttribute("aria-hidden", "true");
  }
});
