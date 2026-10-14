import { expect, test } from "@playwright/test";

import { bookmarkActiveTab, bookmarksCommand, closeActiveTab } from "../../__util__";

test("3. 원본 탭이 없는 북마크를 열면 내용을 복원한다", async ({ page }) => {
  await page.goto("/");
  await bookmarkActiveTab(page, "restored bookmark\nsecond\nthird");
  await closeActiveTab(page);

  await expect(page.locator("textarea")).toHaveValue("");
  await page.reload();
  await bookmarksCommand(page).click();
  await page.getByRole("button", { name: "Open", exact: true }).click();

  await expect(page.locator("textarea")).toHaveValue("restored bookmark\nsecond\nthird");
});
