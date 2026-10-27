import { expect, test } from "@playwright/test";

test("6. 검색 닫기 버튼은 Search 이름을 포함한다", async ({ page }) => {
  await page.goto("/");
  await page.locator(".more-command").click();
  await page.getByRole("button", { name: "SEARCH", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Close Search" }),
  ).toBeVisible();
});
