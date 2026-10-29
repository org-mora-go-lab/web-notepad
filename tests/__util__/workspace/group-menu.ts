import type { Page } from "@playwright/test";

// The group dropdown that opens above the bottom bar's group button.
export const groupMenu = (page: Page) => page.locator("#groups-menu");

// The … button on a group row that reveals its close / share / edit / delete buttons.
export const groupActionsButton = (page: Page, groupName: string) =>
  page.getByRole("button", { name: `${groupName} group actions`, exact: true });

// Picks a labelled group action and opens the row's … button first when needed.
export async function chooseGroupAction(
  page: Page,
  groupName: string,
  action: string,
) {
  const actionName = {
    수정: `Edit ${groupName} group`,
    삭제: `Delete ${groupName} group`,
    "탭 닫기": "Close All",
  }[action];
  if (!actionName) throw new Error(`Unsupported group action: ${action}`);
  const actionButton = page.getByRole("button", {
    name: actionName,
    exact: true,
  });
  if (!(await actionButton.isVisible()))
    await groupActionsButton(page, groupName).click();
  await actionButton.click();
}
