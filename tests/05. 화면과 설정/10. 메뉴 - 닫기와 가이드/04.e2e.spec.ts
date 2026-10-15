import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";

test("4. 모바일 MENU 드롭다운에는 SHORTCUT을 표시하지 않는다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await expect(page.getByRole("menuitem", { name: "SHORTCUT", exact: true })).toBeHidden();
});
