import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../__constant__";
import { deleteTabPopup, expectCssPx } from "../__util__";

test("11. 모바일 우측 패널과 확인 팝업의 아이콘·글자는 PC 크기의 1.2배로 표시한다", async ({ page }) => {
  await page.goto("/");
  await page.locator(".note-area").fill("Keep me");
  const popup = deleteTabPopup(page);

  for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
    await page.setViewportSize(viewport);
    const mobile = viewport.width <= 640;
    await page.locator(".tab-item.is-active .tab-close").click();
    await expect(popup).toBeVisible();
    await expect(popup.locator("h3")).toHaveCSS("font-size", mobile ? "19.2px" : "16px");
    await expect(popup.locator("p")).toHaveCSS("font-size", mobile ? "16.8px" : "14px");
    const cancel = popup.getByRole("button", { name: "Cancel", exact: true });
    await expect(cancel).toHaveCSS("font-size", mobile ? "15.6px" : "13px");
    await expectCssPx(cancel.locator("svg"), "width", mobile ? 16.8 : 14);
    await expectCssPx(popup.locator(".confirm-popup-title > svg"), "width", mobile ? 21.6 : 18);
    await cancel.click();
    await expect(popup).toBeHidden();

    await page.getByRole("button", { name: "MENU", exact: true }).click();
    await page.locator(".global-search-command").click();
    const panel = page.locator("#global-search-panel");
    await expect(panel).toHaveAttribute("aria-hidden", "false");
    await expectCssPx(panel.locator(".side-panel-close svg"), "width", 14.4);
    await expectCssPx(panel.locator(".search-field svg"), "width", mobile ? 18 : 15);
    await expect(panel.locator(".global-search-empty-state p")).toHaveCSS(
      "font-size",
      mobile ? "19.2px" : "16px",
    );
    await page.keyboard.press("Escape");
    await expect(panel).toHaveAttribute("aria-hidden", "true");
  }
});
