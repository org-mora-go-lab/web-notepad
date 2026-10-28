import { expect, test } from "@playwright/test";

test("4. 개인 그룹 탭 메뉴에는 공유 링크가 없다", async ({ page }) => {
  await page.goto("/");
  await page
    .locator(".tab-item .tab-select")
    .first()
    .click({ button: "right" });
  await expect(
    page.getByRole("menuitem", { name: "Link", exact: true }),
  ).toHaveCount(0);
});
