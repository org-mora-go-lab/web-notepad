import { expect, test } from "@playwright/test";

import { chooseTabMenuItem } from "../../__util__";

test("4. 고정 탭은 가운데 클릭으로 닫히지 않는다", async ({ page }) => {
  await page.goto("/");
  const tab = page.locator(".tab-item").first();
  await chooseTabMenuItem(page, "Pin");
  await tab.locator('[role="tab"]').click({ button: "middle" });
  await expect(tab).toHaveClass(/is-pinned/);
  await expect(page.locator(".tab-item")).toHaveCount(1);
});
