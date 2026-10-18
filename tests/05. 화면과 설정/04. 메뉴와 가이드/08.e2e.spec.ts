import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { openHeaderMenu } from "../../__util__";

test("8. 헤더 메뉴는 PC와 모바일에서 가이드·설정·검색·카카오 로그인을 표시한다", async ({ page }) => {
  await page.goto("/");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const tools = await openHeaderMenu(page);
    await expect(tools.getByRole("button")).toHaveText(["GUIDE", "SETTINGS", "SEARCH"]);
    await expect(tools.getByRole("link", { name: "Continue with Kakao" })).toBeVisible();
    await expect(tools.getByRole("switch", { name: "THEME" })).toHaveCount(0);
    await expect(tools.getByRole("separator")).toHaveCount(0);
    await tools.getByRole("button", { name: "GUIDE" }).click();
    await expect(page.locator(".user-guide-progress")).toHaveText("1 / 11");
    await page.keyboard.press("Escape");
  }
});
