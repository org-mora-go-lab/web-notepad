import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";

test("9. 모바일 하단 메뉴는 아이콘 오른쪽에 그룹 이름을 8px 간격으로 표시한다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  const group = page.locator(".group-select-command");
  await expect(group).toHaveCSS("flex-direction", "row");
  await expect(group).toHaveCSS("gap", "8px");
});
