import { expect, test } from "@playwright/test";

import { activeTabItem, restoreFirstClosedTab } from "../../__util__";
import { prepareClosedTabRestore } from "./__util__";

test("2. 복원한 탭을 활성 탭으로 표시한다", async ({ page }) => {
  await prepareClosedTabRestore(page);
  await restoreFirstClosedTab(page);

  await expect(activeTabItem(page).getByRole("tab")).toContainText("restore me");
});
