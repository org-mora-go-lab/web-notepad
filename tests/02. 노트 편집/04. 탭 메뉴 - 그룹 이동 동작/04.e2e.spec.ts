import { expect, test } from "@playwright/test";

import { readStoredState, seedMoveGroupState } from "../../__util__";
import { moveTabToTarget } from "./__util__";

test("4. 오른쪽 패널의 탭을 이동해 비우면 남은 왼쪽 탭으로 분할을 해제한다", async ({
  page,
}) => {
  const editors = page.locator("textarea");
  await seedMoveGroupState(page, { splitSource: true, sourceRight: true });
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
