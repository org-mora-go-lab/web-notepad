import { expect, test } from "@playwright/test";

import { prepareMarkedWorkspace, switchWorkspaceToKorean } from "../__util__";

test("2. 언어 변경은 대시보드 패널의 이름과 닫기 조작 접근성 이름을 바꾼다", async ({ page }) => {
  await prepareMarkedWorkspace(page);
  const settings = await switchWorkspaceToKorean(page);
  await settings.getByRole("button", { name: "설정 닫기", exact: true }).click();
  await page.locator(".dashboard-command").click();
  const dashboard = page.locator("#dashboard-panel");
  await expect(dashboard).toHaveAttribute("aria-label", "대시보드");
  await expect(dashboard.getByRole("button", { name: "대시보드 닫기", exact: true })).toBeVisible();
});
