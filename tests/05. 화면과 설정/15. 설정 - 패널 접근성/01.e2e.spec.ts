import { expect, test } from "@playwright/test";

import { prepareMarkedWorkspace, switchWorkspaceToKorean } from "../__util__";

test("1. 언어 변경은 북마크 패널의 이름과 닫기 조작 접근성 이름을 바꾼다", async ({ page }) => {
  await prepareMarkedWorkspace(page, { bookmark: true });
  const settings = await switchWorkspaceToKorean(page);
  await settings.getByRole("button", { name: "설정 닫기", exact: true }).click();
  await page.locator(".bookmark-command").click();
  await expect(page.locator("#bookmarks-panel")).toHaveAttribute("aria-label", "북마크");
  await expect(page.getByRole("button", { name: "북마크 닫기", exact: true })).toBeVisible();
});
