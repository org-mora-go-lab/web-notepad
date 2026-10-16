import { expect, test } from "@playwright/test";

import {
  activeTabItem,
  bookmarkActiveTab,
  bookmarksCommand,
  closeActiveTab,
  cycleActiveTabColor,
  expectSelectedLines,
  lineButtons,
} from "../../__util__";

test("3. 원본 탭이 없는 북마크를 열면 탭 상태를 복원한다", async ({ page }) => {
  await page.goto("/");
  await bookmarkActiveTab(page, "restored bookmark\nsecond\nthird");
  await cycleActiveTabColor(page, 2);
  await lineButtons(page).nth(1).click();
  await lineButtons(page).nth(2).click();
  await closeActiveTab(page);

  await expect(page.locator("textarea")).toHaveValue("");
  await page.reload();
  await bookmarksCommand(page).click();
  await page.getByRole("button", { name: "Open", exact: true }).click();

  await expect(page.locator("textarea")).toHaveValue("restored bookmark\nsecond\nthird");
  await expect(activeTabItem(page)).toHaveAttribute("data-tab-color", "teal");
  await expectSelectedLines(page, [false, true, true]);
});
