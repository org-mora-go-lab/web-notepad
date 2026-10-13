import { expect, test } from "@playwright/test";

import { openClosedPanel, openSettingsPanel, openShortcutsPanel } from "../__util__";

test("1. 하단 BOOKMARK·DASHBOARD와 MENU의 SHORTCUT·CLOSED·SETTINGS·SEARCH 명령으로 우측 패널을 연다", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "BOOKMARK" }).click();
  await expect(page.locator("#bookmarks-panel")).toHaveAttribute("aria-hidden", "false");
  await page.getByRole("button", { name: "북마크 닫기" }).click();
  await expect(page.locator("#bookmarks-panel")).toHaveAttribute("aria-hidden", "true");

  await expect(page.locator('.footer [aria-controls="shortcuts-panel"]')).toHaveCount(0);
  await openShortcutsPanel(page);
  await expect(page.locator("#shortcuts-panel")).toHaveAttribute("aria-hidden", "false");
  await page.getByRole("button", { name: "단축키 닫기" }).click();
  await expect(page.locator("#shortcuts-panel")).toHaveAttribute("aria-hidden", "true");

  await openClosedPanel(page);
  await expect(page.locator("#closed-panel")).toHaveAttribute("aria-hidden", "false");
  await page.getByRole("button", { name: "닫은 탭 패널 닫기" }).click();
  await expect(page.locator("#closed-panel")).toHaveAttribute("aria-hidden", "true");

  await openSettingsPanel(page);
  await page.getByRole("button", { name: "설정 닫기" }).click();
  await expect(page.locator("#settings-panel")).toHaveAttribute("aria-hidden", "true");

  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.locator(".additional-tools-search").click();
  await expect(page.locator("#global-search-panel")).toHaveAttribute("aria-hidden", "false");
});
