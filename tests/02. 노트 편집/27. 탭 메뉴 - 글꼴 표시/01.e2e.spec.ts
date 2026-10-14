import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { expectCssPx, openTabMenu } from "../../__util__";

test("1. PC 탭 메뉴 문구는 15px, 아이콘은 14px로 표시한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  const tab = page.getByRole("tab").first();
  for (const name of ["Pin", "Bookmark", "Unpin", "Remove bookmark"]) {
    await openTabMenu(tab, DESKTOP_VIEWPORT);
    const item = page.getByRole("menuitem", { name, exact: true });
    await expect(item).toHaveCSS("font-size", "15px");
    await expect(item.locator("span")).toHaveCSS("font-size", "15px");
    await expectCssPx(item.locator("svg"), "width", 14);
    await expectCssPx(item.locator("svg"), "height", 14);
    await item.click();
  }
});
