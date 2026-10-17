import { expect, test } from "@playwright/test";

import { groupsCommand } from "../../__util__";

test("4. 사이드바 GROUP 아래의 MENU 영역을 여닫고 기존 메뉴 기능을 제공한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  const sidebar = page.locator("#groups-menu");
  const groupToggle = sidebar.getByRole("button", { name: "GROUP", exact: true });
  const menuToggle = sidebar.getByRole("button", { name: "MENU", exact: true });
  const groupBox = (await groupToggle.boundingBox())!;
  const menuBox = (await menuToggle.boundingBox())!;
  expect(menuBox.y).toBeGreaterThanOrEqual(groupBox.y + groupBox.height);
  await expect(menuToggle).toHaveAttribute("aria-expanded", "false");
  await menuToggle.click();
  await expect(menuToggle).toHaveAttribute("aria-expanded", "true");
  const tools = page.locator("#group-sidebar-tools");
  await expect(tools.getByRole("switch", { name: "THEME" })).toBeVisible();
  await expect(tools.getByRole("button", { name: "SHORTCUT" })).toBeVisible();
  await expect(tools.getByRole("button", { name: "SETTINGS" })).toBeVisible();
  await expect(tools.getByRole("button", { name: "GUIDE" })).toBeVisible();
  await tools.getByRole("button", { name: "SETTINGS" }).click();
  await expect(page.locator("#groups-menu")).toHaveCount(0);
  await expect(page.locator("#settings-panel")).toHaveAttribute("aria-hidden", "false");
});
