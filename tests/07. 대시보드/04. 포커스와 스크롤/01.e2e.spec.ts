import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardColumn, dashboardPanel, seedDashboardTabs } from "../../__util__";

test("1. 현재 탭 카드는 상태 색상의 옅은 배경·테두리와 접근성 현재 표시로 강조한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const active = dashboardPanel(page).locator(".dashboard-card.is-active");
  await expect(active.locator(".dashboard-card-open")).toContainText("Alpha task");
  await expect(active.locator('[aria-current="true"]')).toHaveCount(1);
  await expect(active).toHaveCSS("border-top-width", "1px");
  await expect(active).toHaveCSS("box-shadow", "none");
  await expect(active).toHaveCSS("outline-style", "none");
  expect(await active.evaluate((card) => getComputedStyle(card).borderTopColor)).toMatch(/(?:\/\s*0\.5\s*\)|,\s*0\.5\s*\))/);
  const colors = await active.evaluate((card) => {
    const sample = document.createElement("span");
    sample.style.backgroundColor = "color-mix(in srgb, var(--dashboard-accent) 12%, var(--color-field))";
    card.append(sample);
    const result = { actual: getComputedStyle(card).backgroundColor, expected: getComputedStyle(sample).backgroundColor };
    sample.remove();
    return result;
  });
  expect(colors.actual).toBe(colors.expected);

  await page.locator(".dashboard-closed-command").click();
  await active.dragTo(dashboardColumn(page, "closed"));
  const closedActive = dashboardColumn(page, "closed").locator(
    ".dashboard-card.is-active",
  );
  const closedColors = await closedActive.evaluate((card) => {
    const column = card.closest<HTMLElement>(".dashboard-closed-column")!;
    const sample = document.createElement("span");
    sample.style.backgroundColor =
      "color-mix(in srgb, var(--dashboard-accent) 12%, var(--color-field))";
    column.append(sample);
    const result = {
      actual: getComputedStyle(card).backgroundColor,
      expected: getComputedStyle(sample).backgroundColor,
    };
    sample.remove();
    return result;
  });
  expect(closedColors.actual).toBe(closedColors.expected);
});
