import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { openGlobalSearchPanel } from "../../__util__";

test("7. 메뉴 검색은 비모달 팝오버로 열리고 Escape와 바깥 클릭으로 닫는다", async ({ page }) => {
  await page.goto("/");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await openGlobalSearchPanel(page);

    const popup = page.locator("#global-search-popup");
    const bounds = (await popup.boundingBox())!;
    const trigger = page.locator('.header [aria-controls="global-search-popup"]');
    const anchor = (await trigger.boundingBox())!;
    expect(bounds.width).toBeCloseTo(Math.min(420, viewport.width - 16), 0);
    expect(bounds.height).toBeCloseTo(180, 0);
    expect(bounds.y).toBeCloseTo(anchor.y + anchor.height + 6, 0);
    expect(bounds.x).toBeGreaterThanOrEqual(8);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width - 8);
    expect(await popup.evaluate((element) => element.matches(":modal"))).toBe(false);
    await expect(popup.getByRole("searchbox")).toBeFocused();
    await expect(popup.locator(".global-search-preview-pane")).toBeHidden();

    await page.keyboard.press("Escape");
    await expect(popup).not.toHaveAttribute("open", "");
    await expect(trigger).toBeFocused();

    await openGlobalSearchPanel(page);
    await page.mouse.click(4, 4);
    await expect(popup).not.toHaveAttribute("open", "");
  }
});
