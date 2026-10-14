import { expect, test } from "@playwright/test";

import { prepareMarkedWorkspace, switchWorkspaceToKorean } from "../__util__";

test("2. 언어 변경은 하단 현재 그룹·북마크 표시와 그룹 메뉴 접근성 이름을 바꾼다", async ({ page }) => {
  await prepareMarkedWorkspace(page, { bookmark: true });
  await expect(page.getByRole("img", { name: "Updated today" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Select group: Ungrouped" })).toBeVisible();

  const panel = await switchWorkspaceToKorean(page);
  await expect(page.getByRole("img", { name: "오늘 업데이트됨" })).toBeVisible();
  await expect(page.getByRole("button", { name: "그룹 선택: Ungrouped" })).toBeVisible();
  await panel.getByRole("button", { name: "설정 닫기", exact: true }).click();

  await page.getByRole("button", { name: "그룹 선택: Ungrouped" }).click();
  await expect(page.locator("#groups-menu")).toHaveAttribute("aria-label", "그룹 선택");
  await expect(page.getByRole("textbox", { name: "새 그룹 이름" })).toBeVisible();
  await expect(page.getByRole("button", { name: "그룹 생성" })).toBeDisabled();
});
