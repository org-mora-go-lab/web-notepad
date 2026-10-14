import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS, tabColors } from "../../__constant__";

test("6. 탭 색상 아이콘과 배경 및 상단 강조선의 색조를 동기화한다", async ({ page }) => {
  await page.goto("/");
  const tab = page.locator(".tab-item").first();
  const colorButton = tab.locator(".dirty-dot");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    for (const [index, color] of tabColors.entries()) {
      await expect(tab).toHaveAttribute("data-tab-color", color.name);
      await expect(tab).toHaveCSS("background-color", color.tabBackground);
      await expect(tab).toHaveCSS("box-shadow", new RegExp(color.stripe));
      await expect.poll(() => colorButton.evaluate(
        (button) => getComputedStyle(button, "::before").backgroundColor,
      )).toBe(color.text);
      if (index < tabColors.length - 1) await colorButton.click();
    }
    await colorButton.click();
  }
});
