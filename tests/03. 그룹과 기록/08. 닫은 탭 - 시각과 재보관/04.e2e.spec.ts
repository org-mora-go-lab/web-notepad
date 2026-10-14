import { expect, test } from "@playwright/test";

import { closeActiveTab, closeActiveTabWithContent, openClosedPanel, restoreFirstClosedTab } from "../../__util__";

test("4. 복원 후 수정하지 않은 탭은 확인 팝업 없이 다시 닫은 탭에 보관한다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "restore without edit");
  await openClosedPanel(page);
  await restoreFirstClosedTab(page);

  await closeActiveTab(page);
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await openClosedPanel(page);
  await expect(page.locator(".closed-item", { hasText: "restore without edit" })).toHaveCount(1);
});
