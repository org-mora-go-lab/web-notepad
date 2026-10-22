import { expect, test } from "@playwright/test";

test("4. 그룹 사이드바는 별도 접기 영역 없이 그룹 목록을 항상 표시한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle groups" }).click();
  await expect(page.locator(".group-section-toggle")).toHaveCount(0);
  await expect(page.locator("#group-sidebar-list")).toBeVisible();
});
