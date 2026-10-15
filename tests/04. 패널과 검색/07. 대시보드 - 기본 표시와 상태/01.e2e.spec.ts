import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";
import { dashboardPanel } from "../__util__";

test("1. BOOKMARK 오른쪽에 DASHBOARD 명령을 표시하고 PC는 아이콘 오른쪽에, 모바일은 아이콘 아래에 라벨을 보이며 누르면 대시보드 패널을 연다", async ({ page }) => {
  await page.goto("/");
  const command = page.locator(".dashboard-command");
  const bookmark = page.locator(".bookmark-command");

  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expect(command.locator("svg")).toHaveClass(/lucide-layout-dashboard/);
  await expect(command.locator(".status-label")).toHaveText("DASHBOARD");
  const bookmarkBox = (await bookmark.boundingBox())!;
  expect((await command.boundingBox())!.x).toBeGreaterThan(bookmarkBox.x + bookmarkBox.width);

  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(command.locator(".status-label")).toBeVisible();
  expect((await command.locator(".status-label").boundingBox())!.y).toBeGreaterThanOrEqual((await command.locator("svg").boundingBox())!.y + 28);
  expect((await command.boundingBox())!.x).toBeGreaterThan((await bookmark.boundingBox())!.x);
  await expect(command.locator("svg")).toBeVisible();

  await command.click();
  await expect(command).toHaveAttribute("aria-expanded", "true");
  await expect(dashboardPanel(page)).toHaveAttribute("aria-hidden", "false");
  await expect(dashboardPanel(page).getByRole("heading", { name: "Dashboard", exact: true })).toBeVisible();
});
