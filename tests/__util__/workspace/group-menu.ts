import type { Page } from "@playwright/test";

// The group dropdown that opens above the bottom bar's group button.
export const groupMenu = (page: Page) => page.locator("#groups-menu");

// The … button on a group row that reveals its pin / edit / delete buttons.
export const groupActionsButton = (page: Page, groupName: string) =>
  page.getByRole("button", { name: `${groupName} group actions`, exact: true });

// Picks a group action ("수정", "삭제", "고정" or "고정 해제"): opens the row's … button first when needed.
export async function chooseGroupAction(page: Page, groupName: string, action: string) {
  const actionName = {
    수정: `Edit ${groupName} group`,
    삭제: `Delete ${groupName} group`,
    고정: `Pin ${groupName} group`,
    "고정 해제": `Unpin ${groupName} group`,
  }[action];
  if (!actionName) throw new Error(`Unsupported group action: ${action}`);
  const actionButton = page.getByRole("button", { name: actionName, exact: true });
  if (!(await actionButton.isVisible())) await groupActionsButton(page, groupName).click();
  await actionButton.click();
}
