import type { Page } from "@playwright/test";

// The ⋮ button that opens a group's Edit/Delete/Pin menu in the group panel.
export const groupMenuButton = (page: Page, groupName: string) =>
  page.getByRole("button", { name: `${groupName} 그룹 메뉴`, exact: true });

// Opens the group's ⋮ menu and picks an action ("수정", "삭제", "고정" or "고정 해제").
export async function chooseGroupAction(page: Page, groupName: string, action: string) {
  await groupMenuButton(page, groupName).click();
  await page.getByRole("menuitem", { name: `${groupName} 그룹 ${action}`, exact: true }).click();
}
