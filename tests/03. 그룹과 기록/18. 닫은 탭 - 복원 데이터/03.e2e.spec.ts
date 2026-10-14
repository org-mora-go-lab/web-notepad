import { expect, test } from "@playwright/test";

import { readStoredState, restoreFirstClosedTab } from "../../__util__";
import { prepareClosedTabRestore } from "./__util__";

test("3. 복원한 탭은 닫은 탭 목록에서 제거한다", async ({ page }) => {
  await prepareClosedTabRestore(page);
  await restoreFirstClosedTab(page);

  expect((await readStoredState(page)).closedTabs).toHaveLength(0);
});
