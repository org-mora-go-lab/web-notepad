import type { Page } from "@playwright/test";

// The group dropdown that opens above the bottom bar's group button.
export const groupMenu = (page: Page) => page.locator("#groups-menu");

// Picks an inline group action button ("수정", "삭제", "고정" or "고정 해제") in the open group dropdown.
export async function chooseGroupAction(page: Page, groupName: string, action: string) {
  await page.getByRole("button", { name: `${groupName} 그룹 ${action}`, exact: true }).click();
}
