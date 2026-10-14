import { expect, test } from "@playwright/test";

import { groupStatusName, restoreFirstClosedTab } from "../../__util__";
import { prepareClosedTabRestore } from "./__util__";

test("1. 닫은 탭을 복원하면 닫을 당시의 그룹으로 전환한다", async ({ page }) => {
  await prepareClosedTabRestore(page);
  await restoreFirstClosedTab(page);

  await expect(groupStatusName(page)).toHaveText("Work");
});
