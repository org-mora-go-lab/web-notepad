import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { readStoredState, seedStoredStateOnLoad, switchGroup } from "../../__util__";

test("6. All Group은 여러 그룹의 빈 탭을 하나만 표시하고 원본을 보존한다", async ({ page }) => {
  const groups = ["ungrouped", "alpha", "beta"].map((id, i) => createGroupFixture(id, id, [createTabFixture("tab-" + (i + 1), "")]));
  await seedStoredStateOnLoad(page, { groups, activeGroupId: "ungrouped" }); await switchGroup(page, "All Group");
  await expect(page.getByRole("tab")).toHaveCount(1); await page.reload(); await expect(page.getByRole("tab")).toHaveCount(1);
  const state = await readStoredState(page); expect(state.groups.map(group => group.tabs.filter(tab => tab.open).length)).toEqual([1, 1, 1]);
});
