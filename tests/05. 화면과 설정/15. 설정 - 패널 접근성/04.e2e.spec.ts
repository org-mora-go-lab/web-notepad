import { expect, test } from "@playwright/test";

import { switchWorkspaceToKorean } from "../__util__";

test("4. 언어 변경 후에도 메뉴에 닫은 탭 항목을 표시하지 않는다", async ({ page }) => {
  await page.goto("/");
  const settings = await switchWorkspaceToKorean(page);
  await settings.getByRole("button", { name: "설정 닫기", exact: true }).click();
  await page.getByRole("button", { name: "메뉴", exact: true }).click();
  await expect(page.getByRole("menuitem", { name: "닫은 탭", exact: true })).toHaveCount(0);
});
