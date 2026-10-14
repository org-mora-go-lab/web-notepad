import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import {
  beginDashboardDrag,
  dashboardColumn,
  dashboardPanel,
  seedDashboardTabs,
} from "../__util__";

test("1. 드롭 없이 드래그를 취소하면 대상 강조와 카드 흐림을 제거한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const source = dashboardColumn(page, "todo").locator(".dashboard-card");
  const dataTransfer = await beginDashboardDrag(page, source);
  await dashboardColumn(page, "in-progress").dispatchEvent("dragover", { dataTransfer });
  await expect(source).toHaveClass(/is-dragging/);

  await source.dispatchEvent("dragend", { dataTransfer });

  await expect(dashboardPanel(page).locator(".is-drop-target, .is-dragging")).toHaveCount(0);
});
