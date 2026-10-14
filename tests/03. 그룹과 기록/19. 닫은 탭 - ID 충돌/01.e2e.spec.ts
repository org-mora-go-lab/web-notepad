import { expect, test } from "@playwright/test";

import { readStoredState, restoreFirstClosedTab } from "../../__util__";
import { seedClosedTabIdCollision } from "./__fixture__";

test("1. 닫은 탭 ID가 열린 탭과 충돌하면 새 ID로 복원해 두 탭을 유지한다", async ({ page }) => {
  await seedClosedTabIdCollision(page);
  await restoreFirstClosedTab(page);

  const tabs = (await readStoredState(page)).groups[0].tabs;
  expect(tabs.map((tab) => tab.content).sort()).toEqual(["archived note", "open note"]);
  expect(new Set(tabs.map((tab) => tab.id)).size).toBe(2);
  await expect(page.locator(".tab-item")).toHaveCount(2);
});
