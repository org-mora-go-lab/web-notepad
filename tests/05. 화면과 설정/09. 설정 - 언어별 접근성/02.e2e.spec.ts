import { expect, test } from "@playwright/test";

import { switchWorkspaceToKorean } from "../__util__";

test("2. 언어 변경은 설정 패널과 조작의 접근성 이름을 바꾼다", async ({ page }) => {
  await page.goto("/");
  const panel = await switchWorkspaceToKorean(page);

  await expect(panel).toHaveAttribute("aria-label", "설정");
  await expect(panel.getByRole("separator", { name: "패널 크기 조절" })).toBeVisible();
  await expect(panel.getByRole("button", { name: "패널 고정", exact: true })).toBeVisible();
  await expect(panel.getByRole("button", { name: "설정 초기화", exact: true })).toBeVisible();
  await expect(panel.getByRole("button", { name: "탭 색상 초기화", exact: true })).toBeVisible();
  await expect(panel.getByRole("button", { name: "탭 색상 무작위 선택", exact: true })).toBeVisible();
  await expect(panel.getByRole("button", { name: "설정 닫기", exact: true })).toBeVisible();
});
