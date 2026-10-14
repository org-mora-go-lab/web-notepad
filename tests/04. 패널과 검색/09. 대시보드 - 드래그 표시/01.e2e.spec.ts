import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../__util__";

test("1. 드래그 대상 카드 영역은 연녹색 배경과 signal 색상의 1px 점선으로 강조한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const source = dashboardColumn(page, "todo").locator(".dashboard-card");
  const target = dashboardColumn(page, "done");
  const area = target.locator(".dashboard-cards");
  const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
  await source.dispatchEvent("dragstart", { dataTransfer });
  await target.dispatchEvent("dragover", { dataTransfer });

  await expect(target).toHaveClass(/is-drop-target/);
  await expect(area).toHaveCSS("background-color", "rgba(143, 227, 176, 0.08)");
  await expect(area).toHaveCSS("outline-style", "dashed");
  await expect(area).toHaveCSS("outline-width", "1px");
  await expect(area).toHaveCSS("outline-color", "rgb(143, 227, 176)");
  await expect(area).toHaveCSS("border-radius", "0px");
  await expect(area).toHaveCSS("box-shadow", "none");
  await expect(area).toHaveCSS("transition-duration", "0s");
});
