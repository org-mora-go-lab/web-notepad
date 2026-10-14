import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";

test("3. 모바일 탭 선택과 닫기 버튼은 44px 높이를 유지한다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  const tab = page.locator(".tab-item").first();

  await expect(tab.getByRole("tab")).toHaveCSS("height", "44px");
  await expect(tab.locator(".tab-close")).toHaveCSS("height", "44px");
});
