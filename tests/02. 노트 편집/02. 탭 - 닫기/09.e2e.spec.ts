import { expect, test } from "@playwright/test";

import {
  addTabButton,
  chooseTabMenuItem,
  deleteTabPopup,
  readStoredState,
} from "../../__util__";

test("9. 북마크된 탭은 확인과 보관 없이 닫는다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.fill("Bookmarked note with long content");
  await chooseTabMenuItem(page, "Bookmark");
  await addTabButton(page).click();

  await page.locator(".tab-item").first().locator(".tab-close").click();
  await expect(deleteTabPopup(page)).toHaveCount(0);
  await expect(page.locator(".tab-item")).toHaveCount(1);
  await expect.poll(async () => (await readStoredState(page)).closedTabs ?? []).toEqual([]);
});
