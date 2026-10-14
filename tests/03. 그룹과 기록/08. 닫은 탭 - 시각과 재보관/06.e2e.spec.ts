import { expect, test } from "@playwright/test";

import { closeActiveTab, closeActiveTabWithContent, confirmTabDelete, openClosedPanel, restoreFirstClosedTab } from "../../__util__";

test("6. 복원한 탭의 내용을 수정한 뒤 닫으면 탭 닫기 확인 팝업을 표시한다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "restore and edit");
  await openClosedPanel(page);
  await restoreFirstClosedTab(page);
  await page.locator("textarea").fill("restore and edit changed");

  await closeActiveTab(page);
  await expect(page.getByRole("alertdialog", { name: "Close tab" })).toBeVisible();
  await confirmTabDelete(page);
});
