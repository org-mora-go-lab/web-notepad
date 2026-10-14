import { expect, test } from "@playwright/test";

import { addTabButton } from "../../__util__";

test("4. 편집기 오른쪽 위가 직접 드롭을 받아도 좌우 분할한다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.fill("first");
  await addTabButton(page).click();
  await editor.fill("second");
  await expect(page.locator(".body")).toHaveCount(1);

  const tab = page.locator(".tab-item").filter({ hasText: "first" });
  const body = page.locator(".body");
  const bodyBox = (await body.boundingBox())!;
  await tab.locator(".tab-title").dragTo(body, {
    targetPosition: { x: bodyBox.width * 0.75, y: bodyBox.height * 0.25 },
  });

  await expect(page.locator(".body")).toHaveCount(2);
  await expect(page.locator(".pane-slot").nth(0).locator("textarea")).toHaveValue("second");
  await expect(page.locator(".pane-slot").nth(1).locator("textarea")).toHaveValue("first");
});
