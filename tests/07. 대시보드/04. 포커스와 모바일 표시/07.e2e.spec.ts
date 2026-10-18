import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { dashboardColumn, dashboardPanel, seedDashboardTabs } from "../../__util__";

test.use({ hasTouch: true, isMobile: true, viewport: MOBILE_VIEWPORT });

test("7. 모바일 터치로 탭 카드를 옮겨도 편집기를 열거나 포커스하지 않는다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");

  const card = dashboardColumn(page, "todo").locator(".dashboard-card", { hasText: "Alpha task" });
  const source = (await card.boundingBox())!;
  const target = (await dashboardColumn(page, "in-progress").boundingBox())!;
  const session = await page.context().newCDPSession(page);
  const start = { x: source.x + source.width / 2, y: source.y + source.height / 2 };
  const finish = { x: target.x + target.width / 2, y: target.y + 40 };
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [start] });
  await page.waitForTimeout(350);
  await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [finish] });
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(dashboardColumn(page, "in-progress")).toContainText("Alpha task");
  await session.detach();

  await expect(dashboardPanel(page)).toHaveAttribute("aria-hidden", "false");
  await expect(page.locator("textarea:focus")).toHaveCount(0);
});
