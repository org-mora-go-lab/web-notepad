import { expect, test } from "@playwright/test";

import { toggleDashboardStatus } from "../../__util__";
import { openPanel } from "../../__util__";
import { dashboardColumn, dashboardPanel, seedDashboardTabs } from "../../__util__";

test("1. PC의 다섯 상태는 같은 폰트 색상과 수정 가능한 표시 이름을 제공한다", async ({
  page,
}) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  await toggleDashboardStatus(page, "icebox");
  await toggleDashboardStatus(page, "closed");
  const statuses = dashboardPanel(page).locator(".dashboard-statuses h3");
  const colors = await statuses.evaluateAll((elements) =>
    elements.map((element) => getComputedStyle(element).color),
  );
  expect(new Set(colors).size).toBe(1);

  const status = dashboardPanel(page).locator(
    '.dashboard-statuses h3[data-status="todo"]',
  );
  const edit = status.getByRole("button", { name: "Edit Todo status name" });

  await status.hover();
  await expect(edit).toBeVisible();
  const [editBox, countBox] = await Promise.all([
    edit.boundingBox(),
    status.locator(".dashboard-count").boundingBox(),
  ]);
  expect(editBox!.x).toBeLessThan(countBox!.x);
  await edit.focus();
  await expect(edit).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await edit.click();
  const input = status.getByRole("textbox", { name: "Edit Todo status name" });
  await input.fill("Backlog");
  await input.press("Enter");

  await expect(status.locator(".dashboard-status-label")).toHaveText("Backlog");
  await expect(dashboardColumn(page, "todo").locator(".dashboard-card")).toHaveCount(1);

  for (const [key, originalName, nextName] of [
    ["icebox", "ICEBOX", "Someday"],
    ["closed", "Closed", "Archived"],
  ] as const) {
    const auxiliaryStatus = dashboardPanel(page).locator(
      `.dashboard-statuses h3[data-status="${key}"]`,
    );
    await auxiliaryStatus.hover();
    await auxiliaryStatus
      .getByRole("button", { name: `Edit ${originalName} status name` })
      .click();
    const auxiliaryInput = auxiliaryStatus.getByRole("textbox", {
      name: `Edit ${originalName} status name`,
    });
    await auxiliaryInput.fill(nextName);
    await auxiliaryInput.press("Enter");
    await expect(auxiliaryStatus.locator(".dashboard-status-label")).toHaveText(
      nextName,
    );
  }

  await page.reload();
  await toggleDashboardStatus(page, "icebox");
  await toggleDashboardStatus(page, "closed");
  await expect(
    dashboardPanel(page).locator('.dashboard-statuses h3[data-status="todo"]'),
  ).toContainText("Backlog");
  await expect(
    dashboardPanel(page).locator('.dashboard-statuses h3[data-status="icebox"]'),
  ).toContainText("Someday");
  await expect(
    dashboardPanel(page).locator('.dashboard-statuses h3[data-status="closed"]'),
  ).toContainText("Archived");
});
