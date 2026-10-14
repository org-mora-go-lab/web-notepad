import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { groupsCommand } from "../../__util__";

test("4. 모바일에서는 그룹 전용 우측 패널과 그룹 검색을 표시하지 않는다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  await groupsCommand(page).click();

  await expect(page.locator('.side-panel[id*="group"]')).toHaveCount(0);
  await expect(page.getByRole("searchbox", { name: /group/i })).toHaveCount(0);
});
