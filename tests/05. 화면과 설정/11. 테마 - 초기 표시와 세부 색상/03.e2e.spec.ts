import { expect, test } from "@playwright/test";

import { addTabButton, chooseTabMenuItem } from "../../__util__";

test("3. LIGHT의 고정된 그레이·그린 탭은 일반 10%·활성 22% 배경을 유지한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.getByRole("menuitem", { name: "THEME", exact: true }).click();
  await page.getByRole("menuitemradio", { name: "LIGHT" }).click();

  const pinned = page.locator(".tab-item").first();
  await chooseTabMenuItem(page, "Pin", pinned);
  await expect(pinned).toHaveCSS("background-color", "rgba(104, 119, 110, 0.22)");
  await addTabButton(page).click();
  await expect(pinned).toHaveCSS("background-color", "rgba(104, 119, 110, 0.1)");

  await pinned.getByRole("tab").click();
  await pinned.locator(".dirty-dot").click();
  await expect(pinned).toHaveCSS("background-color", "rgba(37, 131, 86, 0.22)");
  await page.locator(".tab-item").last().getByRole("tab").click();
  await expect(pinned).toHaveCSS("background-color", "rgba(37, 131, 86, 0.1)");
});
