import { expect, test } from "@playwright/test";

import { settingsPanel } from "../__util__";

test("1. MENU의 SETTINGS를 선택하면 드롭다운을 닫고 우측 패널 영역에 설정 패널을 연다", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "MENU", exact: true });
  await trigger.click();
  const settings = page.getByRole("menuitem", { name: "SETTINGS" });
  await expect(settings).toContainText("SETTINGS");
  await expect(settings.locator("svg")).toHaveClass(/lucide-settings/);
  await settings.click();

  await expect(settingsPanel(page)).toHaveAttribute("aria-hidden", "false");
  await expect(settingsPanel(page)).toBeInViewport();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("menu", { name: "MENU", exact: true })).toHaveCount(0);
  await expect(settingsPanel(page).getByRole("heading", { name: "Settings" })).toBeVisible();
  await expect(settingsPanel(page).getByRole("heading", { name: "Font Size" })).toBeVisible();
  await expect(settingsPanel(page).getByRole("heading", { name: "Tab Colors" })).toBeVisible();
});
