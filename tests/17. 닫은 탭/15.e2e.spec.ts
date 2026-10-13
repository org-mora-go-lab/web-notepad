import { expect, test } from "@playwright/test";

import { addTabButton, bookmarkActiveTab, closeActiveTab, confirmTabDelete, readStoredState } from "../__util__";

test("15. 북마크된 탭은 닫아도 닫은 탭 목록에 보관하지 않는다", async ({ page }) => {
  await page.goto("/");
  await bookmarkActiveTab(page, "bookmarked closed note");
  await addTabButton(page).click();
  await page.locator(".tab-item").first().getByRole("tab").click();
  await closeActiveTab(page);
  await confirmTabDelete(page);

  const { closedTabs = [] } = await readStoredState(page);
  expect(closedTabs).toHaveLength(0);
});
