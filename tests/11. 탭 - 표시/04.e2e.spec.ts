import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { addTabButton } from "../__util__";

test("4. DARK·LIGHT에 맞는 구분선 색상을 불투명도 60%로 옅게 표시한다", async ({ page }) => {
  await page.goto("/");
  await addTabButton(page).click();
  await addTabButton(page).click();

  for (const theme of ["DARK", "LIGHT"]) {
    await page.getByRole("button", { name: "MENU", exact: true }).click();
    await page.getByRole("menuitem", { name: "THEME", exact: true }).click();
    await page.getByRole("menuitemradio", { name: theme, exact: true }).click();
    for (const viewport of BOTH_VIEWPORTS) {
      await page.setViewportSize(viewport);
      const tabs = page.locator(".tab-item");
      await expect(tabs).toHaveCount(3);
      const separators = await tabs.evaluateAll(elements => elements.slice(1).map(element => {
        const style = getComputedStyle(element, "::before");
        return {
          background: style.backgroundColor,
          opacity: style.opacity,
          lineColor: getComputedStyle(element.closest(".header")!).borderBottomColor,
        };
      }));
      for (const separator of separators) {
        expect(separator.background).toBe(separator.lineColor);
        expect(separator.opacity).toBe("0.6");
      }
    }
  }
});
