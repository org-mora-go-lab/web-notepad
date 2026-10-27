import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";
import {
  dashboardColumn,
  groupsCommand,
  openPanel,
  toggleDashboardStatus,
} from "../../__util__";

test("2. 같은 사용자의 다른 기기에는 개인 대시보드 표시 설정을 복원한다", async ({
  browser,
  sharing: { owner, id },
}) => {
  test.setTimeout(60000);
  await openPanel(owner, "dashboard-panel");
  await toggleDashboardStatus(owner, "icebox");
  await toggleDashboardStatus(owner, "done");
  await expect(owner.locator(".home")).toHaveAttribute(
    "data-cloud-save",
    "saved",
    { timeout: 15000 },
  );
  const context = await browser.newContext({
    baseURL: new URL(owner.url()).origin,
  });
  try {
    await context.addCookies(await owner.context().cookies());
    const page = await context.newPage();
    const restored = page.waitForResponse(
      (r) =>
        r.url().endsWith("/api/notepad/history") &&
        r.request().method() === "GET",
    );
    await page.goto("/");
    await restored;
    await groupsCommand(page).click();
    await page
      .locator('.group-item[data-group-id="' + id + '"] .group-select')
      .click();
    await openPanel(page, "dashboard-panel");
    await expect(dashboardColumn(page, "icebox")).toBeVisible();
    await expect(dashboardColumn(page, "done")).toHaveCount(0);
  } finally {
    await context.close();
  }
});
