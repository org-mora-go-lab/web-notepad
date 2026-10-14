import { expect, test } from "@playwright/test";

import { readStoredState, seedMoveGroupState } from "../../__util__";
import { moveTabToTarget } from "./__util__";

test("6. 왼쪽 마지막 탭을 이동하면 오른쪽의 남은 탭을 왼쪽으로 모은다", async ({ page }) => {
  const editors = page.locator("textarea");
  await seedMoveGroupState(page, { splitSource: true, sourceRight: false });
  await expect(editors).toHaveCount(2);

  await moveTabToTarget(page);
  await expect(editors).toHaveCount(1);
  await expect(editors).toHaveValue("Keep source note");
  const [source] = (await readStoredState(page)).groups;
  expect(source.tabs.map((tab) => tab.id)).toEqual(["tab-3"]);
  expect(source.rightTabIds).toEqual([]);
  expect(source.activeRightTabId).toBeNull();
  expect(source.activeTabId).toBe("tab-3");
  expect(source.activePane).toBe("left");
});
