import { expect, test } from "@playwright/test";

import { dashboardColumn, openPanel, seedDashboardTabs } from "../../__util__";

test("5. in-progress 카드 메뉴로 Done로 이동하고 본문을 보존한다", async ({ page }) => {
  await seedDashboardTabs(page); await openPanel(page, "dashboard-panel");
  const card = dashboardColumn(page, "in-progress").locator(".dashboard-card", { hasText: "Beta task" });
  await card.click({ button: "right" });
  await page.getByRole("menuitem", { name: "Move to Done", exact: true }).click();

  const moved = dashboardColumn(page, "done").locator(".dashboard-card", { hasText: "Beta task" });
  await expect(moved).toBeVisible(); await expect(card).toHaveCount(0);
  await moved.click({ button: "right" });
  await expect(page.getByRole("menu").getByRole("menuitem")).toHaveText(["Move Group", "Bookmark"]);
  await page.keyboard.press("Escape");
  await page.reload(); await expect(page.locator("#dashboard-panel")).toHaveAttribute("aria-hidden", "false");
  await expect(moved).toBeVisible();
  await moved.locator(".dashboard-card-open").click();
  await expect(page.locator("textarea").first()).toHaveValue("Beta task");
});
