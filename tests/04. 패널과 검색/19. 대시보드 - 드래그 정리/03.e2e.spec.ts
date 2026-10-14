import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { beginDashboardDrag, dashboardColumn, seedDashboardTabs } from "../__util__";

test("3. 드래그가 컬럼을 벗어나면 대상 강조를 제거한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const source = dashboardColumn(page, "todo").locator(".dashboard-card");
  const target = dashboardColumn(page, "done");
  const area = target.locator(".dashboard-cards");
  const dataTransfer = await beginDashboardDrag(page, source);
  await target.dispatchEvent("dragover", { dataTransfer });

  await target.dispatchEvent("dragleave", { dataTransfer });

  await expect(target).not.toHaveClass(/is-drop-target/);
  await expect(area).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await source.dispatchEvent("dragend", { dataTransfer });
});
