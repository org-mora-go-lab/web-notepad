import { expect, test } from "@playwright/test";

import { dashboardColumn, openPanel, readStoredState } from "../../__util__";
import { seedClosedPanelState } from "./__fixture__";

test("3. 탭 카드를 드래그해 Icebox 상태로 이동한다", async ({ page }) => {
  await seedClosedPanelState(page);
  await openPanel(page, "dashboard-panel");
  await page.locator(".dashboard-icebox-command").click();
  await dashboardColumn(page, "todo").locator(".dashboard-card").dragTo(dashboardColumn(page, "icebox"));
  expect((await readStoredState(page)).groups[0].tabs.find((tab) => tab.id === "open-1")?.dashboardStatus).toBe("icebox");
});
