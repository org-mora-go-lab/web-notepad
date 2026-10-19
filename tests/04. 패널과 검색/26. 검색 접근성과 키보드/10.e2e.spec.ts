import { expect, test } from "@playwright/test";

test("10. 검색 팝업 크기 조절선은 수직 separator로 제공한다", async ({ page }) => {
  await page.goto("/");
  await page.locator(".more-command").click();
  await page.getByRole("button", { name: "SEARCH", exact: true }).click();
  const separator = page.getByRole("separator", { name: "Resize search popup" });
  await expect(separator).toHaveAttribute("aria-orientation", "vertical");
});
