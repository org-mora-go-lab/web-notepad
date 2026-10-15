import { expect, test } from "@playwright/test";

import { seedTwoGroupAllView } from "./__util__";

test("1. All에서도 탭 제목을 드래그해 좌우 분할한다", async ({ page }) => {
  await seedTwoGroupAllView(page);
  const body = page.locator(".body");
  const box = (await body.boundingBox())!;
  await page.locator(".tab-title").filter({ hasText: "second" }).dragTo(body, {
    targetPosition: { x: box.width * 0.75, y: box.height * 0.25 },
  });

  await expect(page.locator(".pane-slot")).toHaveCount(2);
  await expect(page.locator('[data-pane="right"] textarea')).toHaveValue("second");
});
