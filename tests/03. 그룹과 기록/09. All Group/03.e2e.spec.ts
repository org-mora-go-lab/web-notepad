import { expect, test } from "@playwright/test";

import { readStoredState, switchGroup } from "../../__util__";
import { seedAllGroupOriginTabs } from "./__fixture__";

test("3. All Group의 분할 배치는 개별 그룹의 분할 배치와 별도로 관리한다", async ({ page }) => {
  await seedAllGroupOriginTabs(page);
  const body = page.locator(".body");
  const box = (await body.boundingBox())!;
  await page.locator(".tab-title").filter({ hasText: "Work only task" }).dragTo(body, {
    targetPosition: { x: box.width * 0.75, y: box.height * 0.25 },
  });
  await expect(page.locator(".pane-slot")).toHaveCount(2);

  const work = (await readStoredState(page)).groups.find((group) => group.id === "work")!;
  expect(work.rightTabIds).toEqual([]);
  await switchGroup(page, "Work");
  await expect(page.locator(".pane-slot")).toHaveCount(1);
  await switchGroup(page, "All Group");
  await expect(page.locator(".pane-slot")).toHaveCount(2);
});
