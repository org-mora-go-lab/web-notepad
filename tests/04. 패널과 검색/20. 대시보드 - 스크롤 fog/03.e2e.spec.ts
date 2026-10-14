import { expect, test } from "@playwright/test";

import { dashboardPanel, seedScrollableDashboard } from "../__util__";

test("3. fog는 DARK·LIGHT 배경을 따르고 35%에서 65%, 70%에서 25%로 옅어진다", async ({ page }) => {
  await seedScrollableDashboard(page);
  const panel = dashboardPanel(page);
  const list = panel.locator(".dashboard-list");
  const statuses = panel.locator(".dashboard-statuses");
  for (const color of ["#111110", "#fafcfb"]) {
    await panel.evaluate((element, background) => { element.style.setProperty("--color-panel", background); }, color);
    await list.evaluate((element) => { element.scrollTop = 100; });
    const background = await statuses.evaluate((element) => getComputedStyle(element, "::after").backgroundImage);
    expect(background).toContain("linear-gradient");
    expect(background).toContain("35%");
    expect(background).toContain("70%");
    expect(background).toContain("0.65");
    expect(background).toContain("0.25");
    expect(background).toContain(color === "#111110" ? "rgb(17, 17, 16)" : "rgb(250, 252, 251)");
  }
});
