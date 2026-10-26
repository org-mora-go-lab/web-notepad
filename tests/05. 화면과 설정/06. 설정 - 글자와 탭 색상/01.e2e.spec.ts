import { expect, test } from "@playwright/test";

import { openAccountMenu } from "../../__util__";
import { settingsPanel } from "../__util__";

test("1. 계정 메뉴의 SETTINGS를 선택하면 메뉴를 닫고 설정 패널을 연다", async ({ page }) => {
  await page.goto("/");
  const tools = await openAccountMenu(page);
  const settings = tools.getByRole("menuitem", { name: "Settings" });
  await expect(settings).toContainText("Settings");
  await expect(settings.locator("svg")).toHaveClass(/lucide-settings/);
  await settings.click();

  await expect(settingsPanel(page)).toHaveAttribute("aria-hidden", "false");
  await expect(settingsPanel(page)).toBeInViewport();
  await expect(page.locator("#account-menu")).toHaveCount(0);
  await expect(settingsPanel(page).getByRole("heading", { name: "Settings" })).toBeVisible();
  await expect(settingsPanel(page).getByRole("heading", { name: "Font Size" })).toBeVisible();
  await expect(settingsPanel(page).getByRole("heading", { name: "Tab Colors" })).toBeVisible();
});
