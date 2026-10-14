import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../__util__";

test.use({ hasTouch: true, isMobile: true, viewport: MOBILE_VIEWPORT });

test("1. 모바일 카드에 현재 상태를 포함한 44px 상태 버튼을 15px 간격으로 표시한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const card = dashboardColumn(page, "todo")
    .locator(".dashboard-card")
    .filter({ hasText: "Alpha task" });
  const controls = card.getByRole("group", { name: "Change Alpha task status" });

  await expect(controls).toBeVisible();
  const buttons = controls.getByRole("button");
  await expect(buttons).toHaveText(["Todo", "WIP", "Closed"]);
  await expect(buttons.first()).toHaveAttribute("aria-pressed", "true");
  await expect(controls).toHaveCSS("column-gap", "15px");
  for (const button of await buttons.all())
    expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
});
