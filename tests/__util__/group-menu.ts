import type { Page } from "@playwright/test";

// The group dropdown that opens above the bottom bar's group button.
export const groupMenu = (page: Page) => page.locator("#groups-menu");

// The … button on a group row that reveals its pin / edit / delete buttons.
export const groupActionsButton = (page: Page, groupName: string) =>
  page.getByRole("button", { name: `${groupName} 그룹 메뉴`, exact: true });

// Picks a group action ("수정", "삭제", "고정" or "고정 해제"): opens the row's … button first when needed.
export async function chooseGroupAction(page: Page, groupName: string, action: string) {
  const actionButton = page.getByRole("button", { name: `${groupName} 그룹 ${action}`, exact: true });
  if (!(await actionButton.isVisible())) await groupActionsButton(page, groupName).click();
  await actionButton.click();
}
