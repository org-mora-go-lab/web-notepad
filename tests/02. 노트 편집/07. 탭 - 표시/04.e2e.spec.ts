import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { addTabButton } from "../../__util__";

test("4. 첫 탭의 바깥쪽과 새 탭 추가 버튼에는 좌우 테두리를 표시하지 않는다", async ({ page }) => {
  await page.goto("/");
  await addTabButton(page).click();
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    for (const item of await page.locator(".tab-item, .add-tab").all()) {
      await expect(item).toHaveCSS("border-left-width", "0px");
      await expect(item).toHaveCSS("border-right-width", "0px");
    }
  }
});
