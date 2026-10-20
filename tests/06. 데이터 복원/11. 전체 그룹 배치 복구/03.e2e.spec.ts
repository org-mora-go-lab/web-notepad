import { expect, test } from "@playwright/test";

import { readStoredState, restoreWorkspace, switchGroup } from "../../__util__";

test("3. 전체 그룹 분할에서 편집기에 닫힌 탭은 제외한다", async ({ page }) => {
  await restoreWorkspace(
    page,
    {},
    { allGroupLayout: { rightTabIds: ["tab-4", "tab-2"] } },
  );
  expect((await readStoredState(page)).allGroupLayout?.rightTabIds).toEqual([
    "tab-2",
  ]);
  await switchGroup(page, "All Group");
  await expect(page.getByRole("tab")).toHaveCount(3);
});
