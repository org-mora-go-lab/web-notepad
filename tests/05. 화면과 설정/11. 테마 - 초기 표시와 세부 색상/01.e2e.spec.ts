import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";

test("1. LIGHT의 탭과 사이드 패널은 밝은 배경과 짙은 글자를 사용한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.getByRole("menuitem", { name: "THEME", exact: true }).click();
  await page.getByRole("menuitemradio", { name: "LIGHT" }).click();
  await expect(page.locator(".tab-item.is-active")).toHaveCSS("color", "rgb(32, 38, 36)");

  await openPanel(page, "bookmarks-panel");
  const drawer = page.locator("#bookmarks-panel");
  await expect(drawer).toHaveCSS("background-color", "rgb(247, 250, 248)");
  await expect(drawer).toHaveCSS("color", "rgb(32, 38, 36)");
});
