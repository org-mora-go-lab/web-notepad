import { expect, test } from "@playwright/test";

test("3. 검색 팝업은 비모달 상태를 명시한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "SEARCH", exact: true }).click();
  await expect(page.locator("#global-search-popup")).toHaveAttribute("aria-modal", "false");
});
