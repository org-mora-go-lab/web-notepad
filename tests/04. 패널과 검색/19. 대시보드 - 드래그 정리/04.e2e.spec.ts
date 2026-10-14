import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../__util__";

test("4. 드롭을 마치면 대상 강조를 제거한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const source = dashboardColumn(page, "todo").locator(".dashboard-card");
  const target = dashboardColumn(page, "done");

  await source.dragTo(target);

  await expect(target).not.toHaveClass(/is-drop-target/);
  await expect(target.locator(".dashboard-cards")).toHaveCSS(
    "background-color",
    "rgba(0, 0, 0, 0)",
  );
});
