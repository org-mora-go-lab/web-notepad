import { expect, test } from "@playwright/test";

import { openBookmarksPanel, openPanel } from "../../__util__";

test("2. 북마크 팝업은 기존 고정 대시보드와 작업 영역 너비를 보존한다", async ({ page }) => {
  await page.goto("/"); await openPanel(page, "dashboard-panel");
  const before = (await page.locator(".workspace").boundingBox())!.width;
  await openBookmarksPanel(page);
  await expect(page.locator("#dashboard-panel")).toHaveAttribute("aria-hidden", "false");
  expect((await page.locator(".workspace").boundingBox())!.width).toBeCloseTo(before, 0);
  await page.keyboard.press("Escape");
  await expect(page.locator("#dashboard-panel")).toHaveAttribute("aria-hidden", "false");
  expect((await page.locator(".workspace").boundingBox())!.width).toBeCloseTo(before, 0);
});
