import { test } from "@playwright/test";

import {
  bookmarkActiveTab,
  bookmarksCommand,
  closeActiveTab,
  expectSelectedLines,
  lineButtons,
} from "../../__util__";

test("5. 원본 탭이 없는 북마크를 열면 선택한 줄 번호를 복원한다", async ({ page }) => {
  await page.goto("/");
  await bookmarkActiveTab(page, "restored bookmark\nsecond\nthird");
  await lineButtons(page).nth(1).click();
  await lineButtons(page).nth(2).click();
  await closeActiveTab(page);
  await page.reload();

  await bookmarksCommand(page).click();
  await page.getByRole("button", { name: "Open", exact: true }).click();

  await expectSelectedLines(page, [false, true, true]);
});
