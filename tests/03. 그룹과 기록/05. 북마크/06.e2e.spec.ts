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

test("6. 원본 탭이 없으면 내용과 탭 색상 및 선택한 줄을 복원한다", async ({
  page,
}) => {
  await page.goto("/");
  await bookmarkActiveTab(page, "restored bookmark\nsecond\nthird");
  await cycleActiveTabColor(page, 2);
  const lines = lineButtons(page);
  await lines.nth(1).click();
  await lines.nth(2).click();
  await closeActiveTab(page);

  await expect(page.locator("textarea")).toHaveValue("");
  await page.reload();
  await bookmarksCommand(page).click();
  await page.getByRole("button", { name: "Open", exact: true }).click();

  await expect(page.locator("textarea")).toHaveValue("restored bookmark\nsecond\nthird");
  await expect(activeTabItem(page)).toHaveAttribute("data-tab-color", "purple");
  await expectSelectedLines(page, [false, true, true]);
  await expect(lines.nth(1)).toHaveCSS("background-color", "color(srgb 0.764706 0.65098 0.960784 / 0.2)");
});
