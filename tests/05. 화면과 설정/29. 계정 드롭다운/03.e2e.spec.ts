import { expect, test } from "@playwright/test";

import { authenticateBrowser } from "../../__util__";

test("3. 계정 메뉴의 Alarm을 닫으면 계정 버튼으로 포커스를 돌려준다", async ({ page, context }) => {
  await authenticateBrowser(context); await page.goto("/");
  const account = page.locator("button.auth-command"); await account.click();
  await page.getByRole("menuitem", { name: "Alarm", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Alarm" })).toBeVisible();
  await expect(page.locator("#account-menu")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Alarm" })).toHaveCount(0);
  await expect(account).toBeFocused();
});
