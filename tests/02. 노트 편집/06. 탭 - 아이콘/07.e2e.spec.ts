import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS, tabColors } from "../../__constant__";
import { addTabButton, chooseTabMenuItem } from "../../__util__";

test("7. 북마크 아이콘은 PC와 모바일의 활성·비활성 탭에서 탭 색상을 유지한다", async ({ page }) => {
  await page.goto("/");
  const tab = page.locator(".tab-item").first();
  const colorButton = tab.locator(".dirty-dot");
  await chooseTabMenuItem(page, "Bookmark");
  const bookmarkIcon = tab.locator(".tab-bookmark-indicator svg");

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    for (const [index, color] of tabColors.entries()) {
      await expect(bookmarkIcon).toHaveCSS("color", color.text);
      if (index < tabColors.length - 1) await colorButton.click();
    }
    await addTabButton(page).click();
    await expect(tab).not.toHaveClass(/is-active/);
    await expect(bookmarkIcon).toHaveCSS("color", tabColors[2].text);
    await tab.locator('[role="tab"]').click();
    await colorButton.click();
  }
});
