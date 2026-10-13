import { expect, test } from "@playwright/test";

import { openPanel } from "../__util__";
import { beginDashboardDrag, dashboardColumn, seedDashboardTabs } from "./__util__";

test("23. 같은 컬럼 내부의 카드·자식 요소 사이를 이동해도 드롭 강조를 유지한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const source = dashboardColumn(page, "todo").locator(".dashboard-card");
  const dataTransfer = await beginDashboardDrag(page, source);
  const target = dashboardColumn(page, "in-progress");
  await target.dispatchEvent("dragover", { dataTransfer });
  await target.evaluate((element) => {
    const child = element.querySelector(".dashboard-card-open")!;
    element.dispatchEvent(new DragEvent("dragleave", { bubbles: true, relatedTarget: child }));
  });
  await expect(target).toHaveClass(/is-drop-target/);
  await target.locator(".dashboard-card-open").dispatchEvent("dragover", { dataTransfer });
  await expect(target).toHaveClass(/is-drop-target/);
  await source.dispatchEvent("dragend", { dataTransfer });
});
