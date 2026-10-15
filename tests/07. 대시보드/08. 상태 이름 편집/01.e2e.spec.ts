import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardColumn, dashboardPanel, seedDashboardTabs } from "../../__util__";

test("1. PC 상태 hover 시 개수 왼쪽의 수정 아이콘으로 표시 이름만 변경한다", async ({
  page,
}) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const status = dashboardPanel(page).locator(
    '.dashboard-statuses h3[data-status="todo"]',
  );
  const edit = status.getByRole("button", { name: "Edit Todo status name" });

  await status.hover();
  await expect(edit).toBeVisible();
  const [editBox, countBox] = await Promise.all([
    edit.boundingBox(),
    status.locator(".dashboard-count").boundingBox(),
  ]);
  expect(editBox!.x).toBeLessThan(countBox!.x);
  await edit.click();
  const input = status.getByRole("textbox", { name: "Edit Todo status name" });
  await input.fill("Backlog");
  await input.press("Enter");

  await expect(status.locator(".dashboard-status-label")).toHaveText("Backlog");
  await expect(dashboardColumn(page, "todo").locator(".dashboard-card")).toHaveCount(1);
  await page.reload();
  await expect(
    dashboardPanel(page).locator('.dashboard-statuses h3[data-status="todo"]'),
  ).toContainText("Backlog");
});
