import { expect, test } from "@playwright/test";

import { prepareMarkedWorkspace, switchWorkspaceToKorean } from "../__util__";

test("3. 언어 변경은 대시보드 카드 상태·고정·북마크 표시의 접근성 이름을 바꾼다", async ({ page }) => {
  await prepareMarkedWorkspace(page, { bookmark: true, pin: true });
  const settings = await switchWorkspaceToKorean(page);
  await settings.getByRole("button", { name: "설정 닫기", exact: true }).click();
  await page.locator(".dashboard-command").click();
  const dashboard = page.locator("#dashboard-panel");
  await expect(dashboard.getByRole("img", { name: "고정됨" })).toBeVisible();
  await expect(dashboard.getByRole("img", { name: "북마크됨" })).toBeVisible();
  await expect(dashboard.locator(".dashboard-card-status-actions")).toHaveAttribute(
    "aria-label",
    "Alpha task 상태 변경",
  );
});
