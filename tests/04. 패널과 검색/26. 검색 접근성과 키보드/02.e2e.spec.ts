import { expect, test } from "@playwright/test";

test("2. 검색 팝업은 Search 제목으로 이름이 지정된 dialog다", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".group-select-command").click();
  await page.locator(".more-command").click();
  await page.getByRole("button", { name: "SEARCH", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Search" })).toBeVisible();
});
