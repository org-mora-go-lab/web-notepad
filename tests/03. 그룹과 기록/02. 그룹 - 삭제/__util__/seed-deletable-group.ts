import type { Page } from "@playwright/test";

import { bookmarkActiveTab, chooseGroupAction, createGroups, groupsCommand } from "../../../__util__";

// Creates an "Archive" group with a bookmarked note and returns the delete-flow locators;
// `openDelete` presses the group's inline Delete button (`menuButton`) in the open group dropdown.
export async function seedDeletableGroup(page: Page) {
  await page.goto("/");
  await createGroups(page, "Archive");
  await bookmarkActiveTab(page, "archived note");
  return {
    toggle: groupsCommand(page),
    menuButton: page.getByRole("button", { name: "Archive 그룹 삭제", exact: true }),
    openDelete: () => chooseGroupAction(page, "Archive", "삭제"),
    popup: page.getByRole("alertdialog", { name: "Delete group" }),
  };
}
