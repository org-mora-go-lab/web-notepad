import { expect, test } from "@playwright/test";

import { openPanel, readStoredState } from "../../__util__";
import { beginDashboardDrag, dashboardColumn, seedDashboardTabs } from "../__util__";

test("2. 드롭 없이 드래그를 취소하면 저장 데이터를 변경하지 않는다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const source = dashboardColumn(page, "todo").locator(".dashboard-card");
  const before = await readStoredState(page);
  const dataTransfer = await beginDashboardDrag(page, source);
  await dashboardColumn(page, "in-progress").dispatchEvent("dragover", { dataTransfer });

  await source.dispatchEvent("dragend", { dataTransfer });

  expect(await readStoredState(page)).toEqual(before);
  await expect(dashboardColumn(page, "todo")).toContainText("Alpha task");
});
