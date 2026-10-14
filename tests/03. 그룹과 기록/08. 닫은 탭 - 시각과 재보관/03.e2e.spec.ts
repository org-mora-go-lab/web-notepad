import { expect, test } from "@playwright/test";

import { addTabButton, bookmarkActiveTab, closeActiveTab, readStoredState } from "../../__util__";

test("3. 북마크된 탭은 확인 팝업 없이 바로 닫고 닫은 탭 목록에 보관하지 않는다", async ({ page }) => {
  await page.goto("/");
  await bookmarkActiveTab(page, "bookmarked closed note");
  await addTabButton(page).click();
  await page.locator(".tab-item").first().getByRole("tab").click();
  await closeActiveTab(page);
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expect(page.locator(".tab-item")).toHaveCount(1);

  const { closedTabs = [] } = await readStoredState(page);
  expect(closedTabs).toHaveLength(0);
});
