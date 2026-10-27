import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";
import { dashboardPanel } from "../../__util__";

test("1. GROUP과 MORE 사이에 DASHBOARD 명령을 표시하고 패널을 연다", async ({
  page,
}) => {
  await page.goto("/");
  const command = page.locator(".dashboard-command");
  const group = page.locator(".group-select-command");
  const more = page.locator(".more-command");

  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expect(command.locator("svg")).toHaveClass(/lucide-layout-dashboard/);
  await expect(command.locator(".status-label")).toHaveText("DASHBOARD");
  expect((await command.boundingBox())!.x).toBeGreaterThan(
    (await group.boundingBox())!.x,
  );
  expect((await command.boundingBox())!.x).toBeLessThan(
    (await more.boundingBox())!.x,
  );

  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(command.locator(".status-label")).toBeVisible();
  expect(
    (await command.locator(".status-label").boundingBox())!.y,
  ).toBeGreaterThanOrEqual(
    (await command.locator("svg").boundingBox())!.y + 28,
  );
  expect((await command.boundingBox())!.x).toBeGreaterThan(
    (await group.boundingBox())!.x,
  );
  expect((await command.boundingBox())!.x).toBeLessThan(
    (await more.boundingBox())!.x,
  );
  await expect(command.locator("svg")).toBeVisible();

  await command.click();
  await expect(command).toHaveAttribute("aria-expanded", "true");
  await expect(dashboardPanel(page)).toHaveAttribute("aria-hidden", "false");
  await expect(
    dashboardPanel(page).getByRole("heading", {
      name: "Dashboard",
      exact: true,
    }),
  ).toBeVisible();
});
