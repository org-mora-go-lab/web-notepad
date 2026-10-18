import { expect, test } from "@playwright/test";

import { seedSplitState } from "../__util__";

test("9. 오른쪽 패널의 마지막 탭을 닫으면 분할 화면을 해제한다", async ({ page }) => {
  await seedSplitState(page);
  const rightPane = page.locator('.pane-slot[data-pane="right"]');
  await rightPane.getByRole("button", { name: "New tab" }).click();
  await expect(rightPane.locator(".tab-item")).toHaveCount(2);
  await rightPane.locator(".tab-item").last().locator(".tab-close").click();
  await expect(rightPane.locator(".tab-item")).toHaveCount(1);
  await rightPane.locator(".tab-close").click();
  await expect(page.locator(".pane-slot")).toHaveCount(1);
  await expect(page.locator("textarea")).toHaveValue("left");
});
