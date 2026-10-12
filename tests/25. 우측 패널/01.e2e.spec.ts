import { expect, test } from "@playwright/test";

import { groupsCommand, openClosedPanel, openShortcutsPanel } from "../__util__";

test("1. 하단 그룹·BOOKMARK와 MENU의 SHORTCUT·CLOSED 명령으로 우측 패널을 연다", async ({ page }) => {
  await page.goto("/");

  await groupsCommand(page).click();
  await expect(page.locator("#groups-panel")).toHaveAttribute("aria-hidden", "false");
  await page.getByRole("button", { name: "그룹 닫기" }).click();
  await expect(page.locator("#groups-panel")).toHaveAttribute("aria-hidden", "true");

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
});
