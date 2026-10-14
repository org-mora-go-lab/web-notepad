import { expect, test } from "@playwright/test";

import { addTabButton } from "../../__util__";

test("1. 닫기 버튼으로 일반 탭을 닫을 수 있다", async ({ page }) => {
  await page.goto("/");
  const tabs = page.locator(".tab-item");
  await addTabButton(page).click();
  await expect(tabs).toHaveCount(2);
  await tabs.nth(1).locator(".tab-close").click();
  await expect(tabs).toHaveCount(1);
});
