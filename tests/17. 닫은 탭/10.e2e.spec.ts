import { expect, test } from "@playwright/test";

import { closeActiveTabWithContent, closedDeletePopup, openClosedPanel } from "../__util__";

test("10. 남은 닫은 탭 항목이 없으면 Empty Closed를 표시한다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "remove this note");
  await openClosedPanel(page);
  await expect(page.locator(".closed-empty")).toHaveCount(0);

  await page.locator(".closed-item .remove-closed").click();
  await closedDeletePopup(page).getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.locator(".closed-item")).toHaveCount(0);
  await expect(page.locator(".closed-empty")).toHaveText("Empty Closed");
});
