import { expect, test } from "@playwright/test";

test("2. 열린 사이드바는 Menu 이름의 complementary 랜드마크다", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle groups" }).click();
  await expect(page.getByRole("complementary", { name: "Menu" })).toBeVisible();
  await expect(page.locator("#groups-menu h2")).toHaveText("Menu");
});
