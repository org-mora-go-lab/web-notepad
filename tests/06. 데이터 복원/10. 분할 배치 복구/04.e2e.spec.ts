import { expect, test } from "@playwright/test";

import { readActiveGroup, restoreWorkspace } from "../../__util__";

test("4. 왼쪽 상단이 비면 왼쪽 하단 노트를 상단으로 승격한다", async ({
  page,
}) => {
  await restoreWorkspace(page, {
    leftBottomTabIds: ["tab-1", "tab-2", "tab-3"],
    activeLeftBottomTabId: "tab-2",
    activePane: "left-bottom",
  });
  const group = await readActiveGroup(page);
  expect(group.leftBottomTabIds).toEqual([]);
  expect(group.activeTabId).toBe("tab-2");
  expect(group.activePane).toBe("left");
  await expect(page.locator("textarea")).toHaveValue("Beta");
});
