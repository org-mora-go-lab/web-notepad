import { expect, test } from "@playwright/test";

import {
  dashboardColumn,
  dashboardPanel,
  panelPinButton,
  seedScrollableDashboard,
} from "../__util__";

test("6. fog는 카드 클릭·드래그·목록 스크롤 조작을 막지 않는다", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await seedScrollableDashboard(page);
  const panel = dashboardPanel(page);
  await panelPinButton(page, "dashboard-panel").click();
  const list = panel.locator(".dashboard-list");
  const statuses = panel.locator(".dashboard-statuses");
  expect(
    await statuses.evaluate(
      (element) => getComputedStyle(element, "::after").pointerEvents,
    ),
  ).toBe("none");

  await list.hover({ position: { x: 20, y: 8 } });
  await page.mouse.wheel(0, 180);
  await expect.poll(() => list.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);

  await dashboardColumn(page, "todo")
    .locator(".dashboard-card", { hasText: "Task 6" })
    .locator(".dashboard-card-open")
    .click();
  await expect(page.locator("textarea")).toHaveValue("Task 6\nBody");

  await dashboardColumn(page, "in-progress")
    .locator(".dashboard-card", { hasText: "Task 7" })
    .dragTo(dashboardColumn(page, "done"));
  await expect(
    dashboardColumn(page, "done").locator(".dashboard-card", {
      hasText: "Task 7",
    }),
  ).toHaveCount(1);
});
