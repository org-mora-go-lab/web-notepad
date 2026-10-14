import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { expectCssPx, openTabMenu } from "../../__util__";

test("6. 탭 메뉴의 Pin과 Bookmark 글자 크기를 PC 15px·모바일 18px, 아이콘을 PC 14px·모바일 16.8px로 표시한다", async ({ page }) => {
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const tab = page.getByRole("tab").first();
    const mobile = viewport.width <= 640;

    for (const name of ["Pin", "Bookmark", "Unpin", "Remove bookmark"]) {
      await openTabMenu(tab, viewport);
      const item = page.getByRole("menuitem", { name, exact: true });
      await expect(item).toBeVisible();
      await expect(item).toHaveCSS("font-size", mobile ? "18px" : "15px");
      await expect(item.locator("span")).toHaveCSS("font-size", mobile ? "18px" : "15px");
      await expectCssPx(item.locator("svg"), "width", mobile ? 16.8 : 14);
      await expectCssPx(item.locator("svg"), "height", mobile ? 16.8 : 14);
      await item.click();
    }
  }
});
