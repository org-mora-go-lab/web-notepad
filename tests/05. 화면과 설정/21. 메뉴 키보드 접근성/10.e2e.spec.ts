import { expect, test } from "@playwright/test";

test("10. 헤더는 로그인, 하단 더보기는 세 가지 메뉴 항목을 제공한다", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".header .header-auth").getByRole("link", { name: "Continue with Kakao" })).toBeVisible();
  await page.locator(".footer .more-command").click();
  await expect(page.locator("#footer-more-menu").getByRole("button")).toHaveText(["GUIDE", "SETTINGS", "SEARCH"]);
});
