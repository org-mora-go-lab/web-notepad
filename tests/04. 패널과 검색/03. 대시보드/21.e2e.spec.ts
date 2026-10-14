import { expect, test } from "@playwright/test";

import { openPanel, readStoredState } from "../../__util__";
import { beginDashboardDrag, dashboardColumn, dashboardPanel, seedDashboardTabs } from "./__util__";

test("21. 드롭 없이 드래그를 취소하면 강조·카드 흐림을 해제하고 저장 데이터를 유지한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const source = dashboardColumn(page, "todo").locator(".dashboard-card");
  const before = await readStoredState(page);
  const dataTransfer = await beginDashboardDrag(page, source);
  await dashboardColumn(page, "in-progress").dispatchEvent("dragover", { dataTransfer });
  await expect(source).toHaveClass(/is-dragging/);
  await source.dispatchEvent("dragend", { dataTransfer });
  await expect(dashboardPanel(page).locator(".is-drop-target, .is-dragging")).toHaveCount(0);
  expect(await readStoredState(page)).toEqual(before);
  await expect(dashboardColumn(page, "todo")).toContainText("Alpha task");
});
