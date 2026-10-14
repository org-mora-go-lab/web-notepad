import { expect, test } from "@playwright/test";

import { switchWorkspaceToKorean } from "../__util__";

test("3. 언어 변경은 MENU 버튼·드롭다운과 항목의 접근성 이름을 바꾼다", async ({ page }) => {
  await page.goto("/");
  const panel = await switchWorkspaceToKorean(page);
  await panel.getByRole("button", { name: "설정 닫기", exact: true }).click();

  const menuButton = page.getByRole("button", { name: "메뉴", exact: true });
  await menuButton.click();
  await expect(page.getByRole("menu", { name: "메뉴", exact: true })).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "설정", exact: true })).toBeVisible();
});
