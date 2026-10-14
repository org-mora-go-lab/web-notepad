import { expect, test } from "@playwright/test";

import { addTabButton, openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../__util__";

test("4. 새 탭은 비어 있으면 제외하고 내용을 입력하면 첫 색상의 Todo 카드로 표시한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  await page.keyboard.press("Escape");
  await addTabButton(page).click();
  await openPanel(page, "dashboard-panel");
  // The new tab is empty, so it is not listed until it has content.
  await expect(dashboardColumn(page, "todo").locator(".dashboard-card")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await page.locator(".note-area").fill("Fresh note");
  await openPanel(page, "dashboard-panel");
  await expect(dashboardColumn(page, "todo").locator(".dashboard-card")).toHaveCount(2);
  await expect(dashboardColumn(page, "todo")).toContainText("Fresh note");
});
