import { expect, test } from "@playwright/test";

import { dashboardColumn, openClosedPanel, readStoredState } from "../../__util__";
import { seedClosedPanelState } from "./__fixture__";

test("4. 탭 카드를 드래그해 Closed 상태로 이동한다", async ({ page }) => {
  await seedClosedPanelState(page);
  await openClosedPanel(page);
  await dashboardColumn(page, "todo").locator(".dashboard-card").dragTo(dashboardColumn(page, "closed"));
  expect((await readStoredState(page)).groups[0].tabs.find((tab) => tab.id === "open-1")?.dashboardStatus).toBe("closed");
});
