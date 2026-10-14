import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { activeTabItem, addTabButton, chooseTabMenuItem } from "../../__util__";

test("5. 첫 탭의 바깥쪽과 새 탭 추가 버튼에는 좌우 테두리를 표시하지 않고 활성 탭 상단 강조선을 두께 3px로 유지한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("pinned note");
  const pinnedTab = page.locator(".tab-item").first();
  await chooseTabMenuItem(page, "Pin");
  await addTabButton(page).click();
  await addTabButton(page).click();

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const items = page.locator(".tab-item, .add-tab");
    for (const item of await items.all()) {
      await expect(item).toHaveCSS("border-left-width", "0px");
      await expect(item).toHaveCSS("border-right-width", "0px");
    }
    expect(await pinnedTab.evaluate(element => getComputedStyle(element, "::before").content)).toBe("none");
    await expect(pinnedTab).toHaveClass(/is-pinned/);
    await expect(activeTabItem(page)).toHaveCSS("box-shadow", /0px 3px 0px 0px inset/);
    await pinnedTab.locator('[role="tab"]').click();
    await expect(pinnedTab).toHaveCSS("box-shadow", /0px 3px 0px 0px inset/);
    await page.locator(".tab-item").last().locator('[role="tab"]').click();
  }
});
