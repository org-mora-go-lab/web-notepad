import { expect, test } from "@playwright/test";

import {
  openBookmarksPanel,
  readStoredState,
  writeStoredState,
} from "../../__util__";
import { createBookmarkGroupsState } from "./__fixture__";

test("8. 다른 그룹의 북마크를 제거해도 현재 그룹을 유지한다", async ({
  page,
}) => {
  await writeStoredState(page, createBookmarkGroupsState());
  await openBookmarksPanel(page);
  await page
    .locator("#bookmarks-panel .bookmark-item", { hasText: "Work note" })
    .getByRole("button", { name: "Remove bookmark Work note" })
    .click();

  await expect(page.locator("#bookmarks-panel .bookmark-item")).toHaveCount(1);
  const state = await readStoredState(page);
  expect(state.activeGroupId).toBe("ungrouped");
  expect(state.groups.find((group) => group.id === "work")?.bookmarks).toEqual(
    [],
  );
  expect(
    state.groups.find((group) => group.id === "work")?.tabs[0].bookmarked,
  ).toBe(false);
  expect(
    state.groups.find((group) => group.id === "ungrouped")?.bookmarks,
  ).toHaveLength(1);
});
