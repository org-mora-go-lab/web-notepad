import { expect, test } from "@playwright/test";

import { openPanel } from "../__util__";
import { dashboardColumn, seedDashboardTabs } from "./__util__";

test("18. 드롭 강조선은 카드와 6px 간격을 유지하고 드래그 중 카드 위치와 크기를 바꾸지 않는다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const source = dashboardColumn(page, "todo").locator(".dashboard-card");
  const target = dashboardColumn(page, "done");
  const area = target.locator(".dashboard-cards");
  const firstTargetCard = area.locator(".dashboard-card").first();
  const beforeDrag = (await firstTargetCard.boundingBox())!;
  const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
  await source.dispatchEvent("dragstart", { dataTransfer });
  await target.dispatchEvent("dragover", { dataTransfer });
  await expect(target).toHaveClass(/is-drop-target/);
  const highlightedArea = (await area.boundingBox())!;
  const duringDrag = (await firstTargetCard.boundingBox())!;
  expect(duringDrag).toEqual(beforeDrag);
  expect(duringDrag.y - highlightedArea.y).toBeCloseTo(6, 0);
  expect(duringDrag.x - highlightedArea.x).toBeCloseTo(6, 0);
  expect(highlightedArea.x + highlightedArea.width - duringDrag.x - duringDrag.width).toBeCloseTo(6, 0);
  await target.dispatchEvent("dragleave", { dataTransfer });
  await source.dispatchEvent("dragend", { dataTransfer });
  expect(await firstTargetCard.boundingBox()).toEqual(beforeDrag);
});
