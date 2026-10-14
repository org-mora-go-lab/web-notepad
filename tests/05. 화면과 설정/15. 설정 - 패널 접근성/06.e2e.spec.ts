import { expect, test } from "@playwright/test";

import { switchWorkspaceToKorean } from "../__util__";

test("6. 언어 변경은 단축키 패널의 이름과 닫기 조작 접근성 이름을 바꾼다", async ({ page }) => {
  await page.goto("/");
  const settings = await switchWorkspaceToKorean(page);
  await settings.getByRole("button", { name: "설정 닫기", exact: true }).click();
  await page.getByRole("button", { name: "메뉴", exact: true }).click();
  await page.getByRole("menuitem", { name: "단축키", exact: true }).click();
  await expect(page.locator("#shortcuts-panel")).toHaveAttribute("aria-label", "단축키 (mac)");
  await expect(page.getByRole("button", { name: "단축키 (mac) 닫기", exact: true })).toBeVisible();
});
