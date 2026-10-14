import { expect, test } from "@playwright/test";

import { readStoredState, restoreFirstClosedTab } from "../../__util__";
import { seedClosedTabIdCollision } from "./__fixture__";

test("3. ID 충돌을 해소한 두 탭은 새로고침 후에도 서로 다른 ID로 유지한다", async ({ page }) => {
  await seedClosedTabIdCollision(page);
  await restoreFirstClosedTab(page);
  await page.reload();

  const tabs = (await readStoredState(page)).groups[0].tabs;
  expect(tabs).toHaveLength(2);
  expect(new Set(tabs.map((tab) => tab.id)).size).toBe(2);
});
