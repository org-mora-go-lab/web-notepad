import { expect, test } from "@playwright/test";

import { switchWorkspaceToKorean } from "../__util__";

test("5. 언어 변경은 전체 검색 패널과 검색 입력·닫기 조작의 접근성 이름을 바꾼다", async ({ page }) => {
  await page.goto("/");
  const settings = await switchWorkspaceToKorean(page);
  await settings.getByRole("button", { name: "설정 닫기", exact: true }).click();
  await page.getByRole("button", { name: "메뉴", exact: true }).click();
  await page.getByRole("menuitem", { name: "검색", exact: true }).click();
  await expect(page.locator("#global-search-panel")).toHaveAttribute("aria-label", "검색");
  await expect(page.getByRole("searchbox", { name: "전체 검색" })).toBeVisible();
  await expect(page.getByRole("button", { name: "검색 닫기", exact: true })).toBeVisible();
});
