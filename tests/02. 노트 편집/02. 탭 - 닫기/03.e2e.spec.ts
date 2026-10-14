import { expect, test } from "@playwright/test";

import { chooseTabMenuItem } from "../../__util__";

test("3. 고정 탭에는 일반 닫기 버튼을 표시하지 않는다", async ({ page }) => {
  await page.goto("/");
  const tab = page.locator(".tab-item").first();
  await chooseTabMenuItem(page, "Pin");
  await expect(tab).toHaveClass(/is-pinned/);
  await expect(tab.locator(".tab-close")).toHaveCount(0);
});
