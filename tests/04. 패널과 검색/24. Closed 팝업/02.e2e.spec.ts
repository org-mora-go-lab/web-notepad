import { expect, test } from "@playwright/test";

import { openClosedPanel } from "../../__util__";
import { seedClosedPanelState } from "./__fixture__";

test("2. Closed 카드를 기본 대시보드 탭 카드 형식으로 표시한다", async ({ page }) => {
  await seedClosedPanelState(page);
  await openClosedPanel(page);
  const card = page.locator(".dashboard-closed-column .dashboard-card");
  await expect(card).toContainText("Archived note");
  await expect(card.locator(".dashboard-card-preview")).toHaveText("Archived body");
  await expect(page.getByRole("button", { name: "Reopen" })).toHaveCount(0);
  await expect(page.locator(".dashboard-closed-actions")).toHaveCount(0);
});
