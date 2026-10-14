import { test } from "@playwright/test";

import { expectSelectedLines, restoreFirstClosedTab } from "../../__util__";
import { prepareClosedTabRestore } from "./__util__";

test("6. 닫은 탭을 복원하면 선택한 줄 번호를 유지한다", async ({ page }) => {
  await prepareClosedTabRestore(page);
  await restoreFirstClosedTab(page);

  await expectSelectedLines(page, [false, true, false]);
});
