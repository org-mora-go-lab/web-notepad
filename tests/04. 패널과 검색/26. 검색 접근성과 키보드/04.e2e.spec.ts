import { expect, test } from "@playwright/test";

test("4. 검색 팝업을 열면 검색 입력란에 초기 포커스를 둔다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "SEARCH", exact: true }).click();
  await expect(page.getByRole("searchbox", { name: "Search everything" })).toBeFocused();
});
