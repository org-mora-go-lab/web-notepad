import { expect, test } from "@playwright/test";

test("10. 헤더 도구 영역은 메뉴 버튼과 네 가지 메뉴 항목을 제공한다", async ({ page }) => {
  await page.goto("/");
  const tools = page.locator(".header .additional-tools");
  await expect(tools.getByRole("button", { name: "MENU" })).toBeVisible();
  await tools.getByRole("button", { name: "MENU" }).click();
  await expect(tools.locator("#additional-tools-menu").getByRole("button")).toHaveText(["GUIDE", "SETTINGS", "SEARCH"]);
  await expect(tools.getByRole("link", { name: "Continue with Kakao" })).toBeVisible();
});
