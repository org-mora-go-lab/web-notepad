import { expect, test } from "@playwright/test";

import { chooseTabMenuItem } from "../../__util__";

test("1. PC 우클릭 메뉴에서 탭의 고정 상태를 전환한다", async ({ page }) => {
  await page.goto("/");
  const tab = page.locator(".tab-item").first();
  await chooseTabMenuItem(page, "Pin");
  await expect(tab).toHaveClass(/is-pinned/);
  await chooseTabMenuItem(page, "Unpin");
  await expect(tab).not.toHaveClass(/is-pinned/);
});
