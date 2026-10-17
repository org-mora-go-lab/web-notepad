import { expect, test } from "@playwright/test";

test("10. 헤더 도구 영역에는 검색 버튼 하나만 제공한다", async ({ page }) => {
  await page.goto("/");
  const tools = page.locator(".header .additional-tools");
  await expect(tools.getByRole("button")).toHaveCount(1);
  await expect(tools.getByRole("button", { name: "SEARCH" })).toBeVisible();
});
