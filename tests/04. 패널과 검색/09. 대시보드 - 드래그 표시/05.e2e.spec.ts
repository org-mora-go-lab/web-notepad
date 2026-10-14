import { expect, test } from "@playwright/test";

import { addTabButton, openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../__util__";

test("5. 새 탭은 내용을 입력하면 첫 색상의 Todo 카드로 표시된다", async ({ page }) => {
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
  await expect(
    dashboardColumn(page, "todo").locator(".dashboard-card", {
      hasText: "Fresh note",
    }),
  ).toHaveAttribute("data-tab-color", "gray");
});
