import { expect, test } from "@playwright/test";

import { switchWorkspaceToKorean } from "../__util__";

test("4. 언어 변경은 닫은 탭 패널의 이름과 닫기 조작 접근성 이름을 바꾼다", async ({ page }) => {
  await page.goto("/");
  const settings = await switchWorkspaceToKorean(page);
  await settings.getByRole("button", { name: "설정 닫기", exact: true }).click();
  await page.getByRole("button", { name: "메뉴", exact: true }).click();
  await page.getByRole("menuitem", { name: "닫은 탭", exact: true }).click();
  await expect(page.locator("#closed-panel")).toHaveAttribute("aria-label", "닫은 탭");
  await expect(page.getByRole("button", { name: "닫은 탭 닫기", exact: true })).toBeVisible();
});
