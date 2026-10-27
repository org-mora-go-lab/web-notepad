import { expect, test } from "@playwright/test";

test("1. PC 탭 우클릭 메뉴에 Pin·Unpin을 표시하지 않는다", async ({ page }) => {
  await page.goto("/");
  const tab = page.locator(".tab-item").first();
  await tab.getByRole("tab").click({ button: "right" });

  await expect(
    page.getByRole("menuitem", { name: "Pin", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("menuitem", { name: "Unpin", exact: true }),
  ).toHaveCount(0);
});
