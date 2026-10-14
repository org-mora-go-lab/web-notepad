import { expect, test } from "@playwright/test";

import { seedSplitState } from "../__util__";

test("2. 탭 제목을 다른 패널의 탭 행에 드롭해 이동한다", async ({ page }) => {
  await seedSplitState(page);
  const leftPane = page.locator(".pane-slot").nth(0);
  const rightPane = page.locator(".pane-slot").nth(1);
  await rightPane.getByRole("button", { name: "New tab" }).click();
  await rightPane.locator("textarea").fill("extra");

  await rightPane.getByRole("tab", { name: "right", exact: true })
    .locator(".tab-title")
    .dragTo(leftPane.locator(".header"));
  await expect(leftPane.getByRole("tab", { name: "right", exact: true })).toBeVisible();
  await expect(rightPane.getByRole("tab", { name: "extra", exact: true })).toBeVisible();
  await expect(page.locator(".pane-slot")).toHaveCount(2);
});
