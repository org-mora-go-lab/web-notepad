import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { activeTabItem, addTabButton, chooseTabMenuItem } from "../../__util__";

test("5. 활성 탭 상단 강조선은 두께 3px로 유지한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("pinned note");
  const pinnedTab = page.locator(".tab-item").first();
  await chooseTabMenuItem(page, "Pin");
  await addTabButton(page).click();

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(activeTabItem(page)).toHaveCSS("box-shadow", /0px 3px 0px 0px inset/);
    await pinnedTab.getByRole("tab").click();
    await expect(pinnedTab).toHaveCSS("box-shadow", /0px 3px 0px 0px inset/);
    await page.locator(".tab-item").last().getByRole("tab").click();
  }
});
