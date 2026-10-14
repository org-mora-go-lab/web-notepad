import { expect, test } from "@playwright/test";

import { restoreFirstClosedTab } from "../../__util__";
import { prepareClosedTabRestore, RESTORED_CONTENT } from "./__util__";

test("4. 닫은 탭을 복원하면 내용을 유지한다", async ({ page }) => {
  await prepareClosedTabRestore(page);
  await restoreFirstClosedTab(page);

  await expect(page.locator("textarea")).toHaveValue(RESTORED_CONTENT);
});
