import { expect, test } from "@playwright/test";

import {
  addTabButton,
  bookmarkActiveTab,
  bookmarksCommand,
} from "../../__util__";

test("2. 원본 탭이 남아 있는 북마크를 열면 해당 탭을 활성화한다", async ({
  page,
}) => {
  await page.goto("/");
  await bookmarkActiveTab(page, "bookmark source");
  await addTabButton(page).click();
  await page.locator("textarea").fill("other note");

  await bookmarksCommand(page).click();
  await page.getByRole("button", { name: "Open", exact: true }).click();

  await expect(page.locator("textarea")).toHaveValue("bookmark source");
});
