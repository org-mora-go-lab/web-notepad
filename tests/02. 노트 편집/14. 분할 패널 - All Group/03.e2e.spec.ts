import { expect, test } from "@playwright/test";

import { seedTwoGroupAllView } from "./__util__";

test("3. All Group 분할은 탭 소속과 소속 그룹 배치를 바꾸지 않는다", async ({ page }) => {
  await seedTwoGroupAllView(page);
  const body = page.locator(".body");
  const box = (await body.boundingBox())!;
  await page.locator(".tab-title").filter({ hasText: "second" }).dragTo(body, {
    targetPosition: { x: box.width * 0.75, y: box.height * 0.25 },
  });

  const groups = await page.evaluate(() => JSON.parse(localStorage.getItem("web-notepad-storage")!).state.groups);
  const work = groups.find((group: { id: string }) => group.id === "work");
  expect(work.tabs.map((tab: { id: string }) => tab.id)).toEqual(["second"]);
  expect(work.rightTabIds).toEqual([]);
});
