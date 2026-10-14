import { expect, test } from "@playwright/test";

import {
  activeTabItem,
  bookmarkActiveTab,
  bookmarksCommand,
  closeActiveTab,
  cycleActiveTabColor,
} from "../../__util__";

test("4. 원본 탭이 없는 북마크를 열면 탭 색상을 복원한다", async ({ page }) => {
  await page.goto("/");
  await bookmarkActiveTab(page, "restored bookmark color");
  await cycleActiveTabColor(page, 2);
  await closeActiveTab(page);
  await page.reload();

  await bookmarksCommand(page).click();
  await page.getByRole("button", { name: "Open", exact: true }).click();

  await expect(activeTabItem(page)).toHaveAttribute("data-tab-color", "purple");
});
