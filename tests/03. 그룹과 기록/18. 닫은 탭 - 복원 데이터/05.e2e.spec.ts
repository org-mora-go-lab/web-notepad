import { expect, test } from "@playwright/test";

import { activeTabItem, restoreFirstClosedTab } from "../../__util__";
import { prepareClosedTabRestore } from "./__util__";

test("5. 닫은 탭을 복원하면 탭 색상을 유지한다", async ({ page }) => {
  await prepareClosedTabRestore(page);
  await restoreFirstClosedTab(page);

  await expect(activeTabItem(page)).toHaveAttribute("data-tab-color", "purple");
});
