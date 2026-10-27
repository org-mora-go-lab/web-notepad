import { expect, test } from "@playwright/test";

import {
  dashboardColumn,
  openPanel,
  seedDashboardTabs,
  toggleDashboardStatus,
} from "../../__util__";

test("4. todo 카드 메뉴로 Note로 이동하고 본문을 보존한다", async ({
  page,
}) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const card = dashboardColumn(page, "todo").locator(".dashboard-card", {
    hasText: "Alpha task",
  });
  await card.click({ button: "right" });
  await page
    .getByRole("menuitem", { name: "Move to Note", exact: true })
    .click();
  await toggleDashboardStatus(page, "icebox");
  const moved = dashboardColumn(page, "icebox").locator(".dashboard-card", {
    hasText: "Alpha task",
  });
  await expect(moved).toBeVisible();
  await expect(card).toHaveCount(0);
  await moved.click({ button: "right" });
  await expect(page.getByRole("menu").getByRole("menuitem")).toHaveText([
    "Move Group",
    "Bookmark",
  ]);
  await page.keyboard.press("Escape");
  await page.reload();
  await expect(page.locator("#dashboard-panel")).toHaveAttribute(
    "aria-hidden",
    "false",
  );
  await expect(moved).toBeVisible();
  await moved.locator(".dashboard-card-open").click();
  await expect(page.locator("textarea").first()).toHaveValue(
    "Alpha task\nalpha body",
  );
});
