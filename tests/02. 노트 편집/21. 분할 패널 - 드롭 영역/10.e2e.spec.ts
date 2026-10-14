import { expect, test } from "@playwright/test";

import { addTabButton } from "../../__util__";

test("10. 분할 표시 전 편집기가 드롭을 받아도 현재 좌표로 상하 분할한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("first");
  await addTabButton(page).click();
  await page.locator("textarea").fill("second");
  const body = page.locator(".body");
  const box = (await body.boundingBox())!;
  const transfer = await page.evaluateHandle(() => new DataTransfer());
  await page.locator(".tab-title").filter({ hasText: "first" }).dispatchEvent("dragstart", { dataTransfer: transfer });
  await body.dispatchEvent("drop", {
    clientX: box.x + box.width * 0.25,
    clientY: box.y + box.height * 0.75,
    dataTransfer: transfer,
  });

  await expect(page.locator(".pane-slot")).toHaveCount(2);
  await expect(page.locator('[data-pane="left-bottom"] textarea')).toHaveValue("first");
});
