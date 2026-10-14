import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { expectCssPx, openTabMenu } from "../../__util__";

test("2. 모바일 탭 메뉴 문구는 18px, 아이콘은 16.8px로 표시한다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  const tab = page.getByRole("tab").first();
  for (const name of ["Pin", "Bookmark", "Unpin", "Remove bookmark"]) {
    await openTabMenu(tab, MOBILE_VIEWPORT);
    const item = page.getByRole("menuitem", { name, exact: true });
    await expect(item).toHaveCSS("font-size", "18px");
    await expect(item.locator("span")).toHaveCSS("font-size", "18px");
    await expectCssPx(item.locator("svg"), "width", 16.8);
    await expectCssPx(item.locator("svg"), "height", 16.8);
    await item.click();
  }
});
