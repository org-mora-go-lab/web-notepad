import { expect, test } from "@playwright/test";

import { readActiveGroup, restoreWorkspace } from "../../__util__";

test("6. 왼쪽 열이 비면 오른쪽 열을 왼쪽으로 옮겨 편집 공간을 복구한다", async ({
  page,
}) => {
  await restoreWorkspace(page, {
    rightTabIds: ["tab-1", "tab-2", "tab-3"],
    activeRightTabId: "tab-3",
    activePane: "right",
  });
  const group = await readActiveGroup(page);
  expect(group.rightTabIds).toEqual([]);
  expect(group.activeTabId).toBe("tab-3");
  await expect(page.locator("textarea")).toHaveValue("Gamma");
});
