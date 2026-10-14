import { expect, test } from "@playwright/test";

import { closeActiveTab, closeActiveTabWithContent, confirmTabDelete, openClosedPanel, restoreFirstClosedTab } from "../../__util__";

test("4. 복원 후 수정하지 않은 탭은 확인 팝업 없이 닫고 수정하면 팝업을 표시한다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "restore without edit");

  await openClosedPanel(page);
  await restoreFirstClosedTab(page);
  await expect(page.locator("textarea")).toHaveValue("restore without edit");
  await closeActiveTab(page);
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expect(page.locator(".tab-item", { hasText: "restore without edit" })).toHaveCount(0);

  await openClosedPanel(page);
  await expect(page.locator(".closed-item")).toHaveCount(1);
  await restoreFirstClosedTab(page);
  await page.locator("textarea").fill("restore without edit, edited");
  await closeActiveTab(page);
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await confirmTabDelete(page);
  await expect(page.locator(".tab-item", { hasText: "restore without edit" })).toHaveCount(0);
});
