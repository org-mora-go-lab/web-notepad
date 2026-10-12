import type { Page } from "@playwright/test";

import { bookmarkActiveTab, chooseGroupAction, createGroups, groupMenuButton, groupsCommand } from "../../__util__";

// Creates an "Archive" group with a bookmarked note and returns the delete-flow locators;
// `openDelete` picks Delete from the group ⋮ menu (`menuButton`).
export async function seedDeletableGroup(page: Page) {
  await page.goto("/");
  await createGroups(page, "Archive");
  await bookmarkActiveTab(page, "archived note");
  return {
    toggle: groupsCommand(page),
    menuButton: groupMenuButton(page, "Archive"),
    openDelete: () => chooseGroupAction(page, "Archive", "삭제"),
    popup: page.getByRole("alertdialog", { name: "Delete group" }),
  };
}
