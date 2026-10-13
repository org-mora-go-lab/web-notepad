import { expect, test } from "@playwright/test";

import { openPanel } from "../__util__";
import { beginDashboardDrag, dashboardColumn, dashboardPanel, seedDashboardTabs } from "./__util__";

test("22. 다른 컬럼으로 이동한 뒤 이전 컬럼의 이탈 이벤트가 와도 새 대상만 강조한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const source = dashboardColumn(page, "todo").locator(".dashboard-card");
  const dataTransfer = await beginDashboardDrag(page, source);
  const previous = dashboardColumn(page, "in-progress");
  const next = dashboardColumn(page, "done");
  await previous.dispatchEvent("dragover", { dataTransfer });
  await expect(previous).toHaveClass(/is-drop-target/);
  await next.dispatchEvent("dragover", { dataTransfer });
  await previous.dispatchEvent("dragleave", { dataTransfer });
  await expect(previous).not.toHaveClass(/is-drop-target/);
  await expect(next).toHaveClass(/is-drop-target/);
  await expect(dashboardPanel(page).locator(".is-drop-target")).toHaveCount(1);
  await source.dispatchEvent("dragend", { dataTransfer });
});
