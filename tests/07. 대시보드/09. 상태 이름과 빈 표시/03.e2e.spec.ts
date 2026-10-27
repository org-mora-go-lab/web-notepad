import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import {
  dashboardPanel,
  openPanel,
  readStoredState,
  seedDashboardTabs,
  switchGroup,
} from "../../__util__";

test("3. 모든 그룹 대시보드에서는 Edit Status를 비활성화해 일괄 수정을 막는다", async ({
  page,
}) => {
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await seedDashboardTabs(page);
    await switchGroup(page, "All Group");
    const before = (await readStoredState(page)).groups;
    await openPanel(page, "dashboard-panel");
    const panel = dashboardPanel(page);
    await panel.locator(".dashboard-options-trigger").click();
    await expect(
      panel.getByRole("button", { name: "Edit Status", exact: true }),
    ).toBeDisabled();
    await expect(panel.locator(".dashboard-status-edit-hint")).toHaveText(
      "Select a group to edit its status names.",
    );
    await expect(page.locator(".dashboard-status-editor")).toHaveCount(0);
    expect((await readStoredState(page)).groups).toEqual(before);
  }
});
