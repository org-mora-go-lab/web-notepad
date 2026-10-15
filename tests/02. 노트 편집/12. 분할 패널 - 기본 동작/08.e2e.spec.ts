import { expect, test } from "@playwright/test";

import { seedSplitState } from "../__util__";

test("8. 오른쪽 패널의 내용이 있는 탭도 확인 없이 닫고 남은 배치를 정리한다", async ({ page }) => {
  await seedSplitState(page);
  const rightPane = page.locator(".pane-slot").nth(1);
  await expect(rightPane.locator("textarea")).toHaveValue("right");
  await rightPane.locator("textarea").press("End");
  await rightPane.locator("textarea").pressSequentially(" pane note");
  await expect(rightPane.locator("textarea")).toHaveValue("right pane note");
  await rightPane.locator(".tab-close").click();
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expect(page.locator(".body")).toHaveCount(1);
  await expect(page.locator(".tab-title")).toHaveText([/^left$/i]);
});
