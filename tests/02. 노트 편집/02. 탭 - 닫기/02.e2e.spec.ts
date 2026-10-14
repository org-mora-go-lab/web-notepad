import { expect, test } from "@playwright/test";

import { addTabButton } from "../../__util__";

test("2. 가운데 클릭으로 일반 탭을 닫을 수 있다", async ({ page }) => {
  await page.goto("/");
  const tabs = page.locator(".tab-item");
  await addTabButton(page).click();
  await tabs.nth(1).locator('[role="tab"]').click({ button: "middle" });
  await expect(tabs).toHaveCount(1);
});
