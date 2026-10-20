import { expect, test } from "@playwright/test";

import { readStoredState, restoreWorkspace } from "../../__util__";

test("6. 보관 기록 목록이 손상되어도 현재 편집 노트를 복구한다", async ({
  page,
}) => {
  await restoreWorkspace(page, {}, { closedTabs: { broken: true } });
  expect((await readStoredState(page)).closedTabs).toEqual([]);
  await expect(page.locator("textarea")).toHaveValue("Alpha\nsecond\nthird");
});
