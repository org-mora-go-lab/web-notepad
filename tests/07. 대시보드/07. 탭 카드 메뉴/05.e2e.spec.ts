import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../../__util__";

test("5. 우클릭한 탭 카드는 에디터에서 열지 않고 메뉴가 열린 동안 테두리만 강조한다", async ({
  page,
}) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const card = dashboardColumn(page, "in-progress").locator(
    ".dashboard-card",
    { hasText: "Beta task" },
  );
  const originalBackground = await card.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );

  await card.click({ button: "right" });

  await expect(card).toHaveClass(/is-context-menu-target/);
  await expect(card).not.toHaveClass(/is-active/);
  await expect(card.locator(".dashboard-card-open")).not.toHaveAttribute(
    "aria-current",
  );
  await expect(page.locator(".tab-item.is-active")).toContainText("Alpha task");
  await expect(card).toHaveCSS("background-color", originalBackground);
  expect(
    await card.evaluate((element) => getComputedStyle(element).borderTopColor),
  ).toMatch(/(?:\/\s*0\.5\s*\)|,\s*0\.5\s*\))/);

  await page.getByRole("menuitem", { name: "Bookmark", exact: true }).click();
  await expect(card).not.toHaveClass(/is-context-menu-target/);
});
