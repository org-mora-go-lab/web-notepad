import { expect, test } from "@playwright/test";

import {
  openBookmarksPanel,
  readStoredState,
  writeStoredState,
} from "../../__util__";
import { createBookmarkGroupsState } from "./__fixture__";

test("7. 다른 그룹의 북마크를 열면 원래 그룹과 노트로 이동한다", async ({
  page,
}) => {
  await writeStoredState(page, createBookmarkGroupsState());
  await openBookmarksPanel(page);
  await page
    .locator("#bookmarks-panel .bookmark-item", { hasText: "Work note" })
    .getByRole("button", { name: "Open" })
    .click();

  await expect(page.locator("#bookmarks-panel")).toBeHidden();
  await expect(page.locator("textarea")).toHaveValue("Work note\nWork content");
  expect((await readStoredState(page)).activeGroupId).toBe("work");
});
