import { expect, test } from "@playwright/test";

import { confirmTabDelete, deleteTabPopup } from "../__util__";
import { seedSplitState } from "./__util__";

test("6. 오른쪽 패널의 내용이 11자 이상인 탭은 삭제 확인 후에만 닫는다", async ({ page }) => {
  await seedSplitState(page);
  const rightPane = page.locator(".pane-slot").nth(1);
  await expect(rightPane.locator("textarea")).toHaveValue("right");
  await rightPane.locator("textarea").press("End");
  await rightPane.locator("textarea").pressSequentially(" pane note");
  await expect(rightPane.locator("textarea")).toHaveValue("right pane note");
  await rightPane.locator(".tab-close").click();
  await expect(deleteTabPopup(page)).toBeVisible();
  await expect(page.locator(".body")).toHaveCount(2);
  await expect(rightPane.locator("textarea")).toHaveValue("right pane note");
  await confirmTabDelete(page);
  await expect(page.locator(".body")).toHaveCount(1);
  await expect(page.locator(".tab-title")).toHaveText([/^left$/i]);
});
